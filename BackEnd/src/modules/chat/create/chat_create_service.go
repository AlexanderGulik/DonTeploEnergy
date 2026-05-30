package create_message

import (
	"donTeploenergo/src/config"
	"fmt"
	"time"
)

type MessageService struct{}

var messageService *MessageService

func MessageCreateService() *MessageService {
	if messageService == nil {
		messageService = &MessageService{}
	}
	return messageService
}

func (c *MessageService) MessageCreateAdmin(req ChatMessageRequest) error {
	fmt.Printf("Received message request: %+v\n", req)

	query := `INSERT INTO form_messages 
		(form_id, sender_id, sender_type, message_text, is_read, created_at) 
		VALUES($1, $2, $3, $4, $5, $6)`

	_, err := config.DB.Exec(query,
		req.FormID,
		req.AdminID,
		"admin",
		req.Message,
		false,
		time.Now())

	if err != nil {
		fmt.Printf("Error creating message: %v\n", err)
		return err
	}

	return nil
}

func (c *MessageService) MessageCreateUser(req ChatMessageUserRequest, id_user int64) error {
	fmt.Printf("Received message request: %+v\n", req)

	query := `INSERT INTO form_messages 
		(form_id, sender_id, sender_type, message_text, is_read, created_at) 
		VALUES($1, $2, $3, $4, $5, $6)`

	_, err := config.DB.Exec(query,
		req.FormID,
		id_user,
		"user",
		req.Message,
		false,
		time.Now())

	if err != nil {
		fmt.Printf("Error creating message: %v\n", err)
		return err
	}

	return nil
}

func ( c *MessageService) CheckUser(req ChatMessageUserRequest, id_user int64) bool {
	var total int
	queryCheck := `SELECT COUNT(*) FROM form_messages WHERE sender_id = $1 AND form_id = $2 AND sender_type = 'user'`
	err := config.DB.QueryRowx(queryCheck, id_user, req.FormID).Scan(&total)
	if err != nil {
		fmt.Println("Ошибка полученния сообщений пользователя")
		return false
	}
	if total == 0 {
		return false
	}
	return true


}
