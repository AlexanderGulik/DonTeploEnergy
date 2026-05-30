package select_user

import (
	"donTeploenergo/src/config"
	"errors"
	"log"
)

var (
	ErrUserNotPage = errors.New("нету номера страницы")
)

type UserService struct{}

var userService *UserService

func GetUserService() *UserService {
	if userService == nil {
		userService = &UserService{}
	}
	return userService
}

func (s *UserService) GetAll(req *UserPageRequest) ([]ResponseSelectUser, error) {

	if req.ID != 0 {
		rows, err := config.DB.Queryx(`
			SELECT id_user, email, firstname, lastname, phone, d.name as district, address, is_active, u.created_at, last_login
			FROM users u INNER JOIN districts d ON u.id_district = d.id_district WHERE id_user = $1`, req.ID)
		if err != nil {
			log.Printf("Ошибка подключения %v", err)
			return nil, err
		}
		defer rows.Close()

		var users []ResponseSelectUser
		for rows.Next() {
			var user ResponseSelectUser
			err := rows.StructScan(&user)
			if err != nil {
				log.Printf("Ошибка сканирования %v", err)
				continue
			}
			users = append(users, user)
		}
		return users, nil
	}

	if req.Limit == 0 || req.Page == 0 {
		return nil, ErrUserNotPage
	}

	offset := (req.Page - 1) * req.Limit
	rows, err := config.DB.Queryx(`
		SELECT id_user, email, firstname, lastname, phone, d.name as district, address, is_active, u.created_at, last_login
			FROM users u INNER JOIN districts d ON u.id_district =  d.id_district  LIMIT $1 OFFSET $2`, req.Limit, offset)
	if err != nil {
		log.Printf("Ошибка подключения %v", err)
		return nil, err
	}
	defer rows.Close()

	var users []ResponseSelectUser
	for rows.Next() {
		var user ResponseSelectUser
		err := rows.StructScan(&user)
		if err != nil {
			log.Printf("Ошибка сканирования %v", err)
			continue
		}
		users = append(users, user)
	}
	return users, nil
}
