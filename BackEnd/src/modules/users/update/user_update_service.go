package update_user

import (
	"donTeploenergo/src/config"
	"fmt"
)

type UserUpdateService struct{}

var userUpdateService *UserUpdateService

func UserDataUpdateService() *UserUpdateService {
	if userUpdateService == nil {
		userUpdateService = &UserUpdateService{}
	}
	return userUpdateService
}

func (c *UserUpdateService) UpdateDataUser(req UserRequest, id_user int64) error {
	query := fmt.Sprintf(`UPDATE users SET firstname = $1, lastname = $2, phone = $3, address = $4 WHERE id_user = $5`)
	_, err := config.DB.Exec(query, req.Firstname, req.Lastname, req.Phone, req.Address, id_user)
	if err != nil {
			fmt.Println("Error update", err)
			return err
	}
	return nil
}
