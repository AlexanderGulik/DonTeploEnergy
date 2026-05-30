package update_user

type UserRequest struct {
	Firstname string `json:"firstname"`
	Lastname string `json:"lastname"`
	Address string `json:"address"`
	Phone string `json:"phone"`
}
