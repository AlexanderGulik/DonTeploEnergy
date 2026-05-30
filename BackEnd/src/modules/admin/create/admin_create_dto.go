package create_admin

type AdminRequest struct {
	Fio      string `json:"fio"`
	Name     string `json:"name"`
	Password string `json:"pass"`
}
