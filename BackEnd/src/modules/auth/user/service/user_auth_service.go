package service

import (
	"database/sql"
	"donTeploenergo/src/modules/auth/user/dto"
	"donTeploenergo/src/utils"
	"errors"
	"fmt"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUserInvalidCredentials  = errors.New("неверное имя или пароль")
	ErrUserExists              = errors.New("пользователь с таким именем уже существует")
	ErrUserInvalidRefreshToken = errors.New("неверный Refresh Token")
	ErrUserNotFound            = errors.New("пользователь не найден")
	ErrUserInvalidInput        = errors.New("все поля обязательны")
)

type UserAuthService struct {
	db *sql.DB
}

func NewUserAuthService(db *sql.DB) *UserAuthService {
	return &UserAuthService{db: db}
}

func (s *UserAuthService) getUserByEmail(email string) (*dto.UserDB, error) {
	var user dto.UserDB
	err := s.db.QueryRow(
		"SELECT id_user, email, password_hash, firstname, lastname, phone, address FROM users WHERE email = $1",
		email,
	).Scan(&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName, &user.Phone, &user.Address)

	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserAuthService) getUserByID(id int64) (*dto.UserDB, error) {
	var user dto.UserDB
	err := s.db.QueryRow(
		"SELECT id_user, email, password_hash, firstname, lastname, phone, address FROM users WHERE id_user = $1",
		id,
	).Scan(&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName, &user.Phone, &user.Address)

	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserAuthService) createUser(firstName, lastName, email, address, phone, password string, id_district int64) (int64, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return 0, err
	}
	var id int64
	err = s.db.QueryRow(
		"INSERT INTO users (firstName, lastName, created_at, email, password_hash, phone, id_district, address, is_active, last_login) VALUES ($1,$2,$3,$4,$5, $6, $7, $8, $9, $10) RETURNING id_user",
		firstName, lastName, time.Now(), email, string(hashedPassword), phone, id_district, address, true, time.Now(),
	).Scan(&id)
	if err != nil {
		log.Printf("Ошибка SQL %v", err)
		return 0, err
	}
	return id, nil
}

func (s *UserAuthService) userExists(email string) (bool, error) {
	var exists bool
	err := s.db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", email).Scan(&exists)
	return exists, err
}

func (s *UserAuthService) saveRefreshToken(userID int64, refreshToken string) error {
	encryptedToken, err := utils.Encrypt(refreshToken)
	if err != nil {
		log.Printf("Ошибка шифрования токена: %v", err)
		return err
	}

	log.Printf("Сохранение refresh token для userID: %d", userID)

	// Сначала удаляем старый токен
	_, err = s.db.Exec("DELETE FROM user_jwt WHERE id_user = $1", userID)
	if err != nil {
		log.Printf("Ошибка удаления старого токена: %v", err)
		return err
	}

	// Затем вставляем новый
	_, err = s.db.Exec("INSERT INTO user_jwt (id_user, token) VALUES ($1, $2)", userID, encryptedToken)
	if err != nil {
		log.Printf("Ошибка вставки нового токена: %v", err)
		return err
	}

	log.Printf("Refresh token успешно сохранен для userID: %d", userID)
	return nil
}
func (s *UserAuthService) getRefreshToken(userID int64) (string, error) {
	var encryptedToken string
	err := s.db.QueryRow("SELECT token FROM user_jwt WHERE id_user = $1", userID).Scan(&encryptedToken)
	if err != nil {
		return "", err
	}

	return utils.Decrypt(encryptedToken)
}

func (s *UserAuthService) deleteRefreshToken(userID int64) error {
	_, err := s.db.Exec("DELETE FROM user_jwt WHERE id_user = $1", userID)
	return err
}

func (s *UserAuthService) Login(req *dto.UserLoginRequest) (*dto.UserDB, *dto.UserTokenPair, error) {
	if req.Email == "" || req.Password == "" {
		return nil, nil, ErrUserInvalidInput
	}

	user, err := s.getUserByEmail(req.Email)
	fmt.Println(user)
	if err != nil {
		return nil, nil, ErrUserInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, nil, ErrUserInvalidCredentials
	}

	s.deleteRefreshToken(user.ID)

	accessToken, err := utils.GenerateUserAccessToken(user.ID, user.Email)
	if err != nil {
		return nil, nil, err
	}

	refreshToken, err := utils.GenerateUserRefreshToken(user.ID)
	if err != nil {
		return nil, nil, err
	}

	if err := s.saveRefreshToken(user.ID, refreshToken); err != nil {
		return nil, nil, err
	}

	return user, &dto.UserTokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *UserAuthService) Register(req *dto.UserRegisterRequest) (*dto.UserDB, *dto.UserTokenPair, error) {
	log.Printf("=== REGISTER DEBUG ===")
	log.Printf("Raw request: %+v", req)

	// Проверка на пустые поля
	if req.FirstName == "" || req.LastName == "" || req.Password == "" || req.District == 0 {
		log.Println("VALIDATION FAILED - empty fields:")
		return nil, nil, ErrUserInvalidInput
	}

	log.Println("Validation passed, checking if user exists...")

	exists, err := s.userExists(req.Email)
	if err != nil {
		return nil, nil, err
	}
	if exists {
		return nil, nil, ErrUserExists
	}

	UserID, err := s.createUser(req.FirstName, req.LastName, req.Email, req.Address, req.Phone, req.Password, req.District)
	if err != nil {
		return nil, nil, err
	}

	user := &dto.UserDB{
		ID:        UserID,
		Email:     req.Email,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Phone:     req.Phone,
		Address:   req.Address,
	}

	accessToken, err := utils.GenerateUserAccessToken(user.ID, user.Email)
	if err != nil {
		return nil, nil, err
	}

	refreshToken, err := utils.GenerateUserRefreshToken(UserID)
	if err != nil {
		return nil, nil, err
	}

	if err := s.saveRefreshToken(UserID, refreshToken); err != nil {
		return nil, nil, err
	}

	return user, &dto.UserTokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *UserAuthService) Refresh(refreshToken string) (*dto.UserTokenPair, error) {
	if refreshToken == "" {
		return nil, ErrUserInvalidRefreshToken
	}

	claims, err := utils.VerifyUserRefreshToken(refreshToken)
	if err != nil {
		return nil, ErrUserInvalidRefreshToken
	}

	userID := claims.ID

	storedToken, err := s.getRefreshToken(userID)
	if err != nil || storedToken != refreshToken {
		return nil, ErrUserInvalidRefreshToken
	}

	user, err := s.getUserByID(userID)
	if err != nil {
		return nil, ErrUserNotFound
	}

	// Генерируем НОВЫЙ access token
	newAccessToken, err := utils.GenerateUserAccessToken(user.ID, user.Email)
	if err != nil {
		return nil, err
	}

	// Опционально: обновляем refresh token (для дополнительной безопасности)
	newRefreshToken, err := utils.GenerateUserRefreshToken(user.ID)
	if err != nil {
		return nil, err
	}

	// Сохраняем новый refresh token
	if err := s.saveRefreshToken(user.ID, newRefreshToken); err != nil {
		return nil, err
	}

	return &dto.UserTokenPair{
		AccessToken:  newAccessToken,
		RefreshToken: newRefreshToken,
	}, nil
}

func (s *UserAuthService) Logout(refreshToken string) error {
	if refreshToken == "" {
		return ErrUserInvalidRefreshToken
	}

	claims, err := utils.VerifyUserRefreshToken(refreshToken)
	if err != nil {
		return ErrUserInvalidRefreshToken
	}

	return s.deleteRefreshToken(claims.ID)
}
