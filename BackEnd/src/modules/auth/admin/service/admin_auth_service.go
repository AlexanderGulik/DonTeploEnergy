package service

import (
	"database/sql"
	"donTeploenergo/src/modules/auth/admin/dto"
	"donTeploenergo/src/utils"
	"errors"
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrAdminInvalidCredentials  = errors.New("неверное имя или пароль")
	ErrAdminUserExists          = errors.New("пользователь с таким именем уже существует")
	ErrAdminInvalidRefreshToken = errors.New("неверный Refresh Token")
	ErrAdminNotFound            = errors.New("администратор не найден")
	ErrAdminInvalidInput        = errors.New("все поля обязательны")
)

type AdminAuthService struct {
	db *sql.DB
}

func NewAdminAuthService(db *sql.DB) *AdminAuthService {
	return &AdminAuthService{db: db}
}

func (s *AdminAuthService) getAdminByName(name string) (*dto.AdminUserDB, error) {
	var admin dto.AdminUserDB
	err := s.db.QueryRow(
		"SELECT id_admin, login, passhash, roles FROM adminusers WHERE login = $1",
		name,
	).Scan(&admin.ID, &admin.Name, &admin.Password, &admin.Role)

	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (s *AdminAuthService) getAdminByID(id int64) (*dto.AdminUserDB, error) {
	var admin dto.AdminUserDB
	err := s.db.QueryRow(
		"SELECT id_admin, login, roles FROM adminusers WHERE id_admin = $1",
		id,
	).Scan(&admin.ID, &admin.Name, &admin.Role)

	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (s *AdminAuthService) createAdmin(fio, name, password, role string) (int64, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return 0, err
	}
	var id int64
	err = s.db.QueryRow(
		"INSERT INTO adminusers (fio, login, passhash, roles) VALUES ($1,$2,$3,$4) RETURNING id_admin",
		fio, name, string(hashedPassword), role,
	).Scan(&id)
	if err != nil {
		log.Printf("Ошибка SQL %v", err)
		return 0, err
	}
	return id, nil
}

func (s *AdminAuthService) adminExists(name string) (bool, error) {
	var exists bool
	err := s.db.QueryRow("SELECT EXISTS(SELECT 1 FROM adminusers WHERE login = $1)", name).Scan(&exists)
	return exists, err
}

func (s *AdminAuthService) saveRefreshToken(adminID int64, refreshToken string) error {
	encryptedToken, err := utils.Encrypt(refreshToken)
	if err != nil {
		log.Printf("Ошибка шифрования токена: %v", err)
		return err
	}

	query := `
		INSERT INTO admin_jwt (id_admin, token) 
		VALUES ($1, $2) 	
	`

	log.Printf("Сохранение refresh token для adminID: %d", adminID)

	_, err = s.db.Exec(query, adminID, encryptedToken)
	if err != nil {
		log.Printf("Ошибка сохранения refresh token: %v", err)
		return err
	}

	log.Printf("Refresh token успешно сохранен")
	return nil
}

func (s *AdminAuthService) getRefreshToken(adminID int64) (string, error) {
	var encryptedToken string
	err := s.db.QueryRow("SELECT token FROM admin_jwt WHERE id_admin = $1", adminID).Scan(&encryptedToken)
	if err != nil {
		return "", err
	}

	return utils.Decrypt(encryptedToken)
}

func (s *AdminAuthService) deleteRefreshToken(adminID int64) error {
	_, err := s.db.Exec("DELETE FROM admin_jwt WHERE id_admin = $1", adminID)
	return err
}

// Основная бизнес-логика
func (s *AdminAuthService) Login(req *dto.AdminLoginRequest) (*dto.AdminUserDB, *dto.AdminTokenPair, error) {
	if req.Name == "" || req.Password == "" {
		return nil, nil, ErrAdminInvalidInput
	}

	admin, err := s.getAdminByName(req.Name)
	fmt.Println(admin)
	if err != nil {
		return nil, nil, ErrAdminInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(req.Password)); err != nil {
		return nil, nil, ErrAdminInvalidCredentials
	}

	s.deleteRefreshToken(admin.ID)

	accessToken, err := utils.GenerateAdminAccessToken(admin.ID, admin.Name, admin.Role)
	if err != nil {
		return nil, nil, err
	}

	refreshToken, err := utils.GenerateAdminRefreshToken(admin.ID)
	if err != nil {
		return nil, nil, err
	}

	if err := s.saveRefreshToken(admin.ID, refreshToken); err != nil {
		return nil, nil, err
	}

	return admin, &dto.AdminTokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *AdminAuthService) Register(req *dto.AdminRegisterRequest) (*dto.AdminUserDB, *dto.AdminTokenPair, error) {
	log.Printf("=== REGISTER DEBUG ===")
	log.Printf("Raw request: %+v", req)
	log.Printf("Fio: '%s' (length: %d)", req.Fio, len(req.Fio))
	log.Printf("Name: '%s' (length: %d)", req.Name, len(req.Name))
	log.Printf("Password: '%s' (length: %d)", req.Password, len(req.Password))
	log.Printf("Role: '%s' (length: %d)", req.Role, len(req.Role))

	// Проверка на пустые поля
	if req.Fio == "" || req.Name == "" || req.Password == "" || req.Role == "" {
		log.Println("VALIDATION FAILED - empty fields:")
		if req.Fio == "" {
			log.Println("  - Fio is empty")
		}
		if req.Name == "" {
			log.Println("  - Name is empty")
		}
		if req.Password == "" {
			log.Println("  - Password is empty")
		}
		if req.Role == "" {
			log.Println("  - Role is empty")
		}
		return nil, nil, ErrAdminInvalidInput
	}

	log.Println("Validation passed, checking if user exists...")

	exists, err := s.adminExists(req.Name)
	if err != nil {
		return nil, nil, err
	}
	if exists {
		return nil, nil, ErrAdminUserExists
	}

	adminID, err := s.createAdmin(req.Fio, req.Name, req.Password, req.Role)
	if err != nil {
		return nil, nil, err
	}

	admin := &dto.AdminUserDB{
		ID:   adminID,
		Name: req.Name,
		Role: "admin",
	}

	accessToken, err := utils.GenerateAdminAccessToken(admin.ID, admin.Name, admin.Role)
	if err != nil {
		return nil, nil, err
	}

	refreshToken, err := utils.GenerateAdminRefreshToken(adminID)
	if err != nil {
		return nil, nil, err
	}

	if err := s.saveRefreshToken(adminID, refreshToken); err != nil {
		return nil, nil, err
	}

	return admin, &dto.AdminTokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *AdminAuthService) Refresh(refreshToken string) (string, error) {
	if refreshToken == "" {
		return "", ErrAdminInvalidRefreshToken
	}

	claims, err := utils.VerifyAdminRefreshToken(refreshToken)
	if err != nil {
		return "", ErrAdminInvalidRefreshToken
	}

	adminID := claims.ID

	storedToken, err := s.getRefreshToken(adminID)
	if err != nil || storedToken != refreshToken {
		return "", ErrAdminInvalidRefreshToken
	}

	admin, err := s.getAdminByID(adminID)
	if err != nil {
		return "", ErrAdminNotFound
	}

	return utils.GenerateAdminAccessToken(admin.ID, admin.Name, admin.Role)
}

func (s *AdminAuthService) Logout(refreshToken string) error {
	if refreshToken == "" {
		return ErrAdminInvalidRefreshToken
	}

	claims, err := utils.VerifyAdminRefreshToken(refreshToken)
	if err != nil {
		return ErrAdminInvalidRefreshToken
	}

	return s.deleteRefreshToken(claims.ID)
}
