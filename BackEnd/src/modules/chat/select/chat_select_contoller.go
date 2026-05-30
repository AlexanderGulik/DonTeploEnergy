package select_chat_message

import (
	"donTeploenergo/src/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type ChatController struct {
	service *ChatService
}

func NewChatController() *ChatController {
	return &ChatController{service: GetChatService()}
}

func (c *ChatController) GetMessages(w http.ResponseWriter, r *http.Request) {
	// Используем r.PathValue() если ваш роутер поддерживает (Go 1.22+)
	// formIDStr := r.PathValue("id")

	// Или парсим вручную
	path := strings.TrimPrefix(r.URL.Path, "/api/admin/form/")
	path = strings.TrimSuffix(path, "/chat")

	formID, err := strconv.Atoi(path)
	if err != nil {
		http.Error(w, `{"error": "Invalid form ID"}`, http.StatusBadRequest)
		return
	}

	messages, err := c.service.GetAllMessage(formID)
	if err != nil {
		http.Error(w, `{"error": "Failed to get messages"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}

func (c *ChatController) GetMessagesUser(w http.ResponseWriter, r *http.Request) {
	//fmt.Println("Получение сообщений")
	path := strings.TrimPrefix(r.URL.Path, "/api/user/form/")
	path = strings.TrimSuffix(path, "/chat")

	formID, err := strconv.Atoi(path)
	if err != nil {
		http.Error(w, `{"error": "Invalid form ID"}`, http.StatusBadRequest)
		return
	}
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		fmt.Println("Требуется авторизация")
		http.Error(w, `{"error": "Требуется авторизация"}`, http.StatusUnauthorized)
		return
	}

	userID, err := utils.ExtractAdminIDFromToken(authHeader)
	//fmt.Println("Extracted user ID:", userID)
	//fmt.Println("Error extracting:", err)

	if err != nil {
		log.Printf("Ошибка извлечения ID Пользователя: %v", err)
		http.Error(w, `{"error": "Недействительный токен"}`, http.StatusUnauthorized)
		return
	}
	//fmt.Println(formID, userID)
	if !c.service.CheckFormAuthUser(formID, userID) {
		fmt.Println("Не верный айди пользователя")
		http.Error(w, `{"error": "Не верный айди пользователя"}`, http.StatusUnauthorized)
		return
	}
	messages, err := c.service.GetAllMessage(formID)
	if err != nil {
		fmt.Println("Ошибка получения сообщений")
		http.Error(w, `{"error": "Ошибка загрузки сообщений"}`, http.StatusUnauthorized)
		return
	}
	//fmt.Println("сообщения успешно получены")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)

}
