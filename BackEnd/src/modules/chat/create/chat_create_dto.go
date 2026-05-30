package create_message

type ChatMessageRequest struct {
	FormID  int    `json:"form_id"`
	AdminID int    `json:"admin_id"`
	Message string `json:"message"`
}

type ChatMessageUserRequest struct {
	FormID  int    `json:"form_id"`
	Message string `json:"message"`
}
