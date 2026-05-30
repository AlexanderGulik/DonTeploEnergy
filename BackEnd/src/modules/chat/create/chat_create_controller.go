package create_message

import (
	"encoding/json"
	"fmt"
	"net/http"
	"donTeploenergo/src/utils"
	"log"
)

type MessageController struct {
	service *MessageService
}

func NewMessageCreateController() *MessageController {
	return &MessageController{service: MessageCreateService()}
}

func (c *MessageController) CreateMessage(w http.ResponseWriter, r *http.Request) {
	var req ChatMessageRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"serever": "err decode"}`, http.StatusBadRequest)
		return
	}

	fmt.Println(req)
	if err := c.service.MessageCreateAdmin(req); err != nil {
		http.Error(w, `{"server": "err server message"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Сообщение отправлено"})

}

func (c *MessageController) CreateMessageUser(w http.ResponseWriter, r *http.Request) {
	var req ChatMessageUserRequest
	fmt.Println("send message")
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"serever": "err decode"}`, http.StatusBadRequest)
		return
	}

	fmt.Println(req)
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		fmt.Println("Требуется авторизация")
		http.Error(w, `{"error": "Auth error"}`, http.StatusUnauthorized)
		return
	}
	userID, err := utils.ExtractAdminIDFromToken(authHeader)
	if err != nil {
		log.Printf("err extraxt id user: %v", err)
		http.Error(w, `{"error": "Недействительный токен"}`, http.StatusUnauthorized)
		return
	}

	if !c.service.CheckUser(req, userID) {
		log.Printf("err extraxt id user: %v", err)
		http.Error(w, `{"error": "Чужая форма""}`, http.StatusInternalServerError)
		return

	}

	if err := c.service.MessageCreateUser(req, userID); err != nil {
		http.Error(w, `{"server": "err server message"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Сообщение отправлено"})

}
