package select_admin

type ResponseSelectAdmin struct {
	IDadmin int    `db:"id_admin" json:"id_admin"`
	Fio     string `db:"fio" json:"fio"`
	Login   string `db:"login" json:"name"`
	Roles   string `db:"roles" json:"role"`
}

type AdminsResponse struct {
	Data  []ResponseSelectAdmin `json:"data"`
	Total int                   `json:"total"`
	Page  int                   `json:"page"`
	Pages int                   `json:"pages"`
}

type AdminPageRequest struct {
	ID    int `json "id_admin"`
	Page  int `json "page"`
	Limit int `json "limit"`
}
