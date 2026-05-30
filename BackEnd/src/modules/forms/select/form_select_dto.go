package form_select

import "database/sql"

type FormSelectPageRequest struct {
	Page     int    `json:"page"`
	Limit    int    `json:"limit"`
	Form     string `json:"name_form"`
	Statuses string `json:"statuses`
}

type ResponseSelectFormPage struct {
	ID_form  int           `db:"id_form" json:"ID_form"`
	FIO      string        `db:"fio" json:"FIO"`
	Address  string        `db:"address" json:"Address"`
	Phone    string        `db:"phone" json:"Phone"`
	Data     string        `db:"created_at" json:"Data"`
	ID_user  int           `db:"id_user" json:"ID_user"`
	ID_admin sql.NullInt64 `db:"id_admin" json:"ID_admin"`
	Status   string        `db:"status" json:"Status"`
}

type PaginatedResponse struct {
	Data       []ResponseSelectFormPage `json:"data"`
	Pagination struct {
		Page  int `json:"page"`
		Limit int `json:"limit"`
		Total int `json:"total"`
		Pages int `json:"pages"`
	} `json:"pagination"`
}
