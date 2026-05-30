package take_form

import (
	"donTeploenergo/src/config"
	"fmt"
)

type ServiceForm struct{}

var serviceForm *ServiceForm

func ServiceTakeForm() *ServiceForm {
	if serviceForm == nil {
		serviceForm = &ServiceForm{}
	}
	return serviceForm
}

func (c *ServiceForm) TakeForm(id_form int, id_admin int64) error {

	query := fmt.Sprintf(`UPDATE forms SET id_admin = $1, status = 'active' WHERE id_form = $2`)

	fmt.Printf("Executing query: %s with values: admin_id=%d, form_id=%d\n", query, id_admin, id_form)

	result, err := config.DB.Exec(query, id_admin, id_form)
	if err != nil {
		fmt.Println("err logic take form:", err)
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		fmt.Println("Warning: No rows updated. Form may not exist or already taken.")
	}

	return nil
}
