package create_admin

import (
	adminservice "donTeploenergo/src/modules/auth/admin/service"
	"fmt"
)

type AdminService struct{}

var adminSerivce *AdminService

func CreateAdminService() *AdminService {
	if adminSerivce == nil {
		adminSerivce = &AdminService{}
	}
	return adminSerivce
}

func (c *AdminService) CreateAdmin(r AdminRequest) error {

	_, err := adminservice.Register(r)
	if err != nil {
		fmt.Println("Ошибка")
		return err
	}
	return nil

}
