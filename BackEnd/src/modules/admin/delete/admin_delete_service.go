package delete_admin

import (
	"donTeploenergo/src/config"
	"fmt"
)

type AdminService struct{}

var adminService *AdminService

func AdminDeleteService() *AdminService {
	if adminService == nil {
		adminService = &AdminService{}
	}
	return adminService
}

func (c *AdminService) DeleteAdmin(id int) error {
	_, err := config.DB.Exec(`DELETE FROM adminusers WHERE id_admin = $1`, id)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}
