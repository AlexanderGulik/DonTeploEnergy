package form_create

import (
	"donTeploenergo/src/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type FormController struct {
	service *FormService
}

func NewFormController() *FormController {
	return &FormController{service: GetFormService()}
}

// POST /api/forms/emergency
func (c *FormController) CreateForm(w http.ResponseWriter, r *http.Request) {

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

	var req FormRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Неверный JSON"}`, http.StatusBadRequest)
		return
	}

	if err := c.service.CreateForm(req, userID); err != nil {
		log.Printf("Ошибка подключения к БД: %v", err)
		http.Error(w, `{"error": "Ошибка сохранения"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	fmt.Println("Успешно добавлена Аварийная заяка")
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Аварийная заявка принята."})
}
