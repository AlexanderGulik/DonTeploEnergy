package select_chat_message

import (
	"donTeploenergo/src/config"
	"fmt"
)

type ChatService struct{}

var chatService *ChatService

func GetChatService() *ChatService {
	if chatService == nil {
		chatService = &ChatService{}
	}
	return chatService
}

func (c *ChatService) GetAllMessage(formID int) ([]ChatMessageResponse, error) {
	rows, err := config.DB.Queryx(`SELECT id_message, form_id, sender_id, sender_type, message_text, is_read, created_at FROM form_messages WHERE form_id = $1`, formID)
	if err != nil {
		fmt.Println("error query ", err)
		return nil, err
	}
	defer rows.Close()
	var messages []ChatMessageResponse

	for rows.Next() {
		var msg ChatMessageResponse
		err := rows.StructScan(&msg)
		if err != nil {
			fmt.Println("Error Scaning", err)
			continue
		}
		messages = append(messages, msg)
	}
	if err = rows.Err(); err != nil {
		fmt.Println("Error after rows iteration:", err)
		return nil, err
	}
	return messages, nil
}

func (c *ChatService) CheckFormAuthUser(formID int, userID int64) bool {
	var total int
	queryCheck := `SELECT COUNT(*) FROM form_messages WHERE sender_id = $1 AND form_id = $2 AND sender_type = 'user'`
	err := config.DB.QueryRowx(queryCheck, userID, formID).Scan(&total)
	if err != nil {
		fmt.Println("Ошибка полученния сообщений пользователя")
		return false
	}
	if total == 0 {
		return false
	}
	return true
}
