package update_admin

type AdminRequest struct {
	Fio      string `json:"fio"`
	Name     string `json:"name"`
	Password string `json:"password"`
	Role     string `json:"role"`
}
