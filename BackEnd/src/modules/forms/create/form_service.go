package form_create

import (
	"donTeploenergo/src/config"
	"errors"
	"fmt"
	"time"
)

var (
	ErrFormName = errors.New("неверное название формы")
)

type FormService struct{}

var formService *FormService

func GetFormService() *FormService {
	if formService == nil {
		formService = &FormService{}
	}
	return formService
}

func (s *FormService) CreateForm(form FormRequest, userID int64) error {

	validFormTypes := map[string]bool{
		"emergency": true,
		"noheating": true,
		"nowatter":  true,
	}
//	fmt.Println(form)
	if !validFormTypes[form.Type] {
		fmt.Println("Ошибка типа формы")
		return ErrFormName
	}
	var id_form int64
	err := config.DB.QueryRow(`
        INSERT INTO forms (form_type, address, phone, data, id_user,id_admin, created_at, updated_at, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,  'pending') RETURNING id_form
    `, form.Type, form.Address, form.Phone, form.Data, userID, nil, time.Now(), time.Now()).Scan(&id_form)
	if err != nil {
		return fmt.Errorf("ошибка создания формы %w", err)
	}

	_, err = config.DB.Exec(`INSERT INTO form_messages (form_id, sender_id, sender_type, message_text, is_read, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
		id_form, userID, "user", form.Data, false, time.Now())

	if err != nil {
		return fmt.Errorf("ошибка создания сообщения: %w", err)
	}

	return err
}
