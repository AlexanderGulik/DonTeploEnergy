package take_form

type FormPageRequest struct {
	ID_form   int    `json:"formId"`
	Name_form string `json:"formType"`
	//	Address  string `json:"address"`
	//	Phone    string `json:"phone"`
	//	Data     string `json:"data"`
	// ID_user  int `json:id_user"`
	// ID_admin int `json:"id_admin"`
	//	Status   string `json:"status"`
}
