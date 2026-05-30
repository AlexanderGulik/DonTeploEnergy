package update_form

type FormUpdateRequest struct {
	FormID   int    `json: "formId"`
	Status   string `json: "status"`
	FormType string `json: "formType"`
	AdminID  int    `json: "adminId"`
}
