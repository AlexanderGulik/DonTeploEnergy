package select_chat_message

import "time"

type ChatMessageResponse struct {
	ID         int       `db:"id_message" json:"id"`
	FormID     int       `db:"form_id" json:"form_id"`
	SenderID   int       `db:"sender_id" json:"sender_id"`
	SenderType string    `db:"sender_type" json:"sender_type"`
	Message    string    `db:"message_text" json:"message"`
	IsRead     bool      `db:"is_read" json:"is_read"`
	CreatedAt  time.Time `db:"created_at" json:"created_at"`
}

type GetMessagesRequest struct {
	FormID int `json:"form_id"`
}
