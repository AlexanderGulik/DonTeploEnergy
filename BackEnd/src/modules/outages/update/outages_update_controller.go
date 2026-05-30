package update_outages

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type OutagesController struct {
	service *OutagesService
}

func NewOutagesUpdateController() *OutagesController {
	return &OutagesController{service: UpdateOutagesService()}
}

func (c *OutagesController) UpdateOutages(w http.ResponseWriter, r *http.Request) {
	var req OutagesRequest
	pathParts := strings.Split(r.URL.Path, "/")
	var idStr string
	for i := len(pathParts) - 1; i >= 0; i-- {
		if pathParts[i] != "" {
			idStr = pathParts[i]
			break
		}
	}
	if idStr == "" {
		http.Error(w, `{"error": "ID не указан"}`, http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		log.Printf("Ошибка преобразования ID: %v", err)
		http.Error(w, `{"error": "Неверный ID "}`, http.StatusBadRequest)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": Ошибка сохранения"}`, http.StatusBadRequest)
		return
	}

	if err := c.service.UpdateOutages(req, id); err != nil {
		log.Printf("Ошибка подключения к БД: %v", err)
		http.Error(w, `{"error": Ошибка сохранения"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	fmt.Println("Успешно изменен Отключение")
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Отключение измененно."})
}
