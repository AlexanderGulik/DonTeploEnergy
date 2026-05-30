package change_password

import (
	"donTeploenergo/src/config"
	"fmt"
	"errors"
	"golang.org/x/crypto/bcrypt"
)
var (
	ErrCheckPassword = errors.New("Не верный пароль")
)
type ChangePassService struct {}

var chagePasswordService *ChangePassService

func ChangePasswordService() *ChangePassService {
	if chagePasswordService == nil {
		chagePasswordService = &ChangePassService{}
	}
	return chagePasswordService
}

func (s *ChangePassService) ChangePassword(req ChangePasswordRequest, user_id int64) error {

	if !CheckPassword(user_id, req.OldPassword) {
		fmt.Println(req.OldPassword)
		fmt.Println("error check")
		return ErrCheckPassword
	}
password_hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)

	if err != nil {
		fmt.Println("err Encrypt", err)
		return err
	}
	_, err = config.DB.Exec("UPDATE users SET password_hash = $1 WHERE id_user = $2", password_hash, user_id)
	if err != nil {
		fmt.Println("error QueryRow", err)
		return err
	}
	return nil

}

func CheckPassword(user_id int64, password string) bool {
    var storedHash string
    
    row := config.DB.QueryRow("SELECT password_hash FROM users WHERE id_user = $1", user_id)
    err := row.Scan(&storedHash)
    if err != nil {
        fmt.Println("error exec sql query", err)
        return false
    }
    
    err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(password))
    if err != nil {
        fmt.Println("Invalid password")
        return false
    }
    
    return true
}
