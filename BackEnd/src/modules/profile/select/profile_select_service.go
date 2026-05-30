package select_profile

import (
	"donTeploenergo/src/config"
	"fmt"
	"log"
)

type ProfileService struct{}

var profileService *ProfileService

func GetProfileService() *ProfileService {
	if profileService == nil {
		profileService = &ProfileService{}
	}
	return profileService
}

func (s *ProfileService) GetProfile(id_user int64) (*ProfileResponse, error) {
	var result ProfileResponse
	err := config.DB.QueryRowx(` 
		SELECT firstName, lastName, email, address, phone, d.name AS name_district, s.created_at FROM users s INNER JOIN districts d ON s.id_district = d.id_district WHERE id_user = $1;
	`, id_user).StructScan(&result)
	if err != nil {
		log.Printf("Ошибка профиля: %v", err)
		return nil, err
	}
	return &result, nil

}

func (s *ProfileService) GetApplication(id_user int64, page int) (*PaginatedResponse, error) {
	var result []ApplicationResponse
	limit := 10

	offset := (page - 1) * limit
	query := `
			SELECT 
			f.id_form,
			f.address,
			f.phone,
			f.status,
			f.created_at,
			f.updated_at,
			f.data
		FROM forms f WHERE id_user = $1 ORDER BY f.created_at DESC LIMIT $2 OFFSET $3`
	rows, err := config.DB.Queryx(query, id_user, limit, offset)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	for rows.Next() {
		var form ApplicationResponse
		err := rows.StructScan(&form)
		if err != nil {
			log.Println("Ошибка сканирования", err)
			continue
		}
		result = append(result, form)
	}
	var total int
	countQuery := `SELECT COUNT(*) FROM forms WHERE id_user = $1`
	err = config.DB.QueryRowx(countQuery, id_user).Scan(&total)
	if err != nil {
		return nil, err
	}
	pages := total / limit
	if total%limit != 0 {
		pages++
	}
	response := &PaginatedResponse{
		Data: result,
	}
	response.Pagination.Page = page
	response.Pagination.Limit = limit
	response.Pagination.Total = total
	response.Pagination.Pages = pages
	return response, nil
}
