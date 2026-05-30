package select_admin

import (
	"donTeploenergo/src/config"
	"errors"
	"log"
)

var (
	ErrAdminNotPAge = errors.New("Нету номера странцицы")
)

type AdminService struct{}

var adminService *AdminService

func SelectAdminService() *AdminService {
	if adminService == nil {
		adminService = &AdminService{}
	}
	return adminService
}

func (s *AdminService) SelectAdmin(req *AdminPageRequest) (*AdminsResponse, error) {
	if req.ID != 0 {
		rows, err := config.DB.Queryx("SELECT id_admin, fio, login, roles from adminusers WHERE id_admin = $1", req.ID)
		if err != nil {
			log.Printf("Ошибка подключения %v", err)
			return nil, err
		}
		var admins []ResponseSelectAdmin
		for rows.Next() {
			var admin ResponseSelectAdmin
			err := rows.StructScan(&admin)
			if err != nil {
				log.Printf("Ошибка сканирования %v", err)
				return nil, err
			}
			admins = append(admins, admin)
		}
		if len(admins) == 0 {
			return &AdminsResponse{
				Data:  []ResponseSelectAdmin{},
				Total: 0,
				Page:  1,
				Pages: 0,
			}, nil
		}
		return &AdminsResponse{
			Data:  admins,
			Total: 1,
			Page:  1,
			Pages: 1,
		}, nil
	}
	if req.Limit == 0 || req.Page == 0 {
		return nil, ErrAdminNotPAge
	}

	offset := (req.Page - 1) * req.Limit
	var total int
	err := config.DB.Get(&total, "SELECT COUNT(*) FROM adminusers")
	if err != nil {
		log.Printf("Ошибка подсчета записей: %v", err)
		return nil, err
	}

	rows, err := config.DB.Queryx("SELECT id_admin, fio, login, roles from adminusers LIMIT $1 OFFSET $2", req.Limit, offset)

	if err != nil {
		log.Printf("Ошибка подключения %v", err)
		return nil, err
	}
	var admins []ResponseSelectAdmin

	for rows.Next() {
		var admin ResponseSelectAdmin
		err := rows.StructScan(&admin)
		if err != nil {
			log.Printf("Ошибка сканирования")
			continue
		}
		admins = append(admins, admin)

	}

	pages := total / req.Limit
	if total%req.Limit != 0 {
		pages++
	}
	return &AdminsResponse{
		Data:  admins,
		Total: total,
		Page:  req.Page,
		Pages: pages,
	}, nil

}
