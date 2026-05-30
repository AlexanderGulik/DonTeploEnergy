package create_outages

import (
	"donTeploenergo/src/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type OutagesController struct {
	service *OutagesService
}

func NewOutagesCreateController() *OutagesController {
	return &OutagesController{service: CreateOutagesService()}
}

func (c *OutagesController) CreateOutages(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")

	if authHeader == "" {
		http.Error(w, `{"error": "Требуется авторизация"}`, http.StatusUnauthorized)
		return
	}

	adminID, err := utils.ExtractAdminIDFromToken(authHeader)
	if err != nil {
		log.Printf("Ошибка извлечения ID администратора: %v", err)
		http.Error(w, `{"error": "Недействительный токен"}`, http.StatusUnauthorized)
		return
	}

	var req OutagesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": Ошибка сохранения"}`, http.StatusBadRequest)
		return
	}

	if err := c.service.CreateOutages(req, adminID); err != nil {
		log.Printf("Ошибка подключения к БД: %v", err)
		http.Error(w, `{"error": Ошибка сохранения"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	fmt.Println("Успешно добавлено новое отключение")
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Отключение добавлено."})
}
