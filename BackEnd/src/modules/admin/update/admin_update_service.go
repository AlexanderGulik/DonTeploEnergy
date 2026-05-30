package update_admin

import (
	"donTeploenergo/src/config"
	"log"

	"golang.org/x/crypto/bcrypt"
)

type AdminService struct{}

var adminService *AdminService

func UpdateAdminService() *AdminService {
	if adminService == nil {
		adminService = &AdminService{}
	}
	return adminService
}

func (c *AdminService) UpdateAdmin(req AdminRequest, id int) error {
	log.Println(req.Password)
	if req.Password != "" {

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Println(err)
			return err
		}

		log.Println(hashedPassword)

		_, err = config.DB.Exec("UPDATE adminusers SET fio = $1, login = $2, passhash = $3, roles = $4 WHERE id_admin = $5", req.Fio, req.Name, hashedPassword, req.Role, id)
		if err != nil {
			log.Println(err)
			return err
		}
	} else {

		_, err := config.DB.Exec("UPDATE adminusers SET fio = $1, login = $2, roles = $3 WHERE id_admin = $4", req.Fio, req.Name, req.Role, id)
		if err != nil {
			log.Println(err)
			return err
		}

	}
	return nil
}
