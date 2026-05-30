package form_select

import (
	"donTeploenergo/src/config"
	"errors"
	"log"
	"strings"

	"github.com/jmoiron/sqlx"
)

var (
	ErrFormNotPage = errors.New("Нету номера страницы")
	ErrFormName    = errors.New("неверное название формы")
)

type FormService struct{}

var formService *FormService

func GetFormService() *FormService {
	if formService == nil {
		formService = &FormService{}
	}
	return formService
}

func (s *FormService) GetAll(req *FormSelectPageRequest) (*PaginatedResponse, error) {
	if req.Limit == 0 || req.Page == 0 {
		return nil, ErrFormNotPage
	}

	validFormTypes := map[string]bool{
		"emergency": true,
		"noheating": true,
		"nowatter":  true,
		"":          true,
	}

	if !validFormTypes[req.Form] {
		return nil, ErrFormName
	}

	offset := (req.Page - 1) * req.Limit

	baseQuery := `
		SELECT 
			f.id_form,
			CONCAT(u.lastname, ' ', u.firstname, ' ') as fio,
			f.address,
			f.phone,
			f.id_user,
			f.id_admin,
			f.status,
			f.created_at
		FROM forms f 
		LEFT JOIN users u ON u.id_user = f.id_user`

	var rows *sqlx.Rows
	var err error
	var total int

	if req.Form != "" {
		log.Println(req.Statuses)
		partsStaus := strings.Split(req.Statuses, ",")
		var query string
		if len(partsStaus) == 2 {
			query = baseQuery + ` WHERE f.form_type = $1 AND f.status = $2 OR f.status =  $3 ORDER BY f.created_at DESC LIMIT $4 OFFSET $5`
			rows, err = config.DB.Queryx(query, req.Form, partsStaus[0], partsStaus[1], req.Limit, offset)
		} else if len(partsStaus) == 1 {
			query = baseQuery + ` WHERE f.form_type = $1 AND f.status = $2 ORDER BY f.created_at DESC LIMIT $3 OFFSET $4`
			rows, err = config.DB.Queryx(query, req.Form, partsStaus[0], req.Limit, offset)
		} else {
			log.Printf("Ошибка подключения статсуса")
			return nil, nil
		}

	} else {
		query := baseQuery + ` ORDER BY f.created_at DESC LIMIT $1 OFFSET $2`
		rows, err = config.DB.Queryx(query, req.Limit, offset)

	}

	if err != nil {
		log.Printf("Ошибка подключения %v", err)
		return nil, err
	}
	defer rows.Close()

	var forms []ResponseSelectFormPage
	for rows.Next() {
		var form ResponseSelectFormPage
		err := rows.StructScan(&form)
		if err != nil {
			log.Printf("Ошибка сканирования %v", err)
			continue
		}
		forms = append(forms, form)
	}

	pages := total / req.Limit
	if total%req.Limit != 0 {
		pages++
	}

	response := &PaginatedResponse{
		Data: forms,
	}
	response.Pagination.Page = req.Page
	response.Pagination.Limit = req.Limit
	response.Pagination.Total = total
	response.Pagination.Pages = pages

	return response, nil
}

func (s *FormService) GetByID(formID int) (*ResponseSelectFormPage, error) {
	query := `
		SELECT 
			f.id_form, 
			CONCAT(u.firstname, ' ', COALESCE(u.midname, ''), ' ', u.lastname) as fio,
			f.address, 
			f.phone, 
			f.data, 
			f.id_user, 
			f.id_admin, 
			f.status,
			f.form_type,
			f.created_at
		FROM forms f 
		LEFT JOIN users u ON u.id_user = f.id_user
		WHERE f.id_form = $1`

	var form ResponseSelectFormPage
	err := config.DB.Get(&form, query, formID)
	if err != nil {
		log.Printf("Ошибка получения формы по ID %d: %v", formID, err)
		return nil, err
	}

	return &form, nil
}
