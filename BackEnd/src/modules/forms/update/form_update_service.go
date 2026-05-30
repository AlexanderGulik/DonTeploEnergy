package update_form

import (
	"donTeploenergo/src/config"
	"fmt"
)

type FormService struct{}

var formService *FormService

func FormUpdateService() *FormService {
	if formService == nil {
		formService = &FormService{}
	}
	return formService
}

func (c *FormService) UpdateForm(req FormUpdateRequest) error {

	validStatus := map[string]bool{
		"pending":   true,
		"active":    true,
		"completed": true,
		"cancelled": true,
	}

	if req.Status == "cancelled" {
		query := fmt.Sprintf(`UPDATE forms SET status = 'pending', id_admin = NULL WHERE id_form = $1`)
		_, err := config.DB.Exec(query, req.FormID)
		if err != nil {
			fmt.Printf("Ошибка запроса: %v\n", err)
			return err
		}
		return nil
	} else {
		if !validStatus[req.Status] {
			return fmt.Errorf("invalid status: %s", req.Status)
		}

		query := fmt.Sprintf(`UPDATE forms SET status = $1 WHERE id_form = $2`)
		_, err := config.DB.Exec(query, req.Status, req.FormID)

		if err != nil {
			fmt.Printf("Ошибка запроса: %v\n", err)
			return err
		}
	}

	return nil
}
