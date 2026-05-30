package take_form

import (
	"donTeploenergo/src/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type FormController struct {
	service *ServiceForm
}

func NewFormTakeController() *FormController {
	return &FormController{service: ServiceTakeForm()}
}

func (c *FormController) TakeForm(w http.ResponseWriter, r *http.Request) {
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

	var req FormPageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Println("Ошибка декодирования:", err)
		http.Error(w, `{"error": "err decode ticket"}`, http.StatusBadRequest)
		return
	}

	//fmt.Printf("Parsed request: Name_form='%s', ID_form=%d, TokenAdminID=%d\n",
	//req.Name_form, req.ID_form, adminID)

	if err := c.service.TakeForm(req.ID_form, adminID); err != nil {
		fmt.Println("Ошибка Взятия тикета:", err)
		http.Error(w, `{"error": "err take ticket"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}
