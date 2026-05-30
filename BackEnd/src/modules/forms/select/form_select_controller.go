package form_select

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

type FormSelectController struct {
	service *FormService
}

func NewFormSelectController() *FormSelectController {
	return &FormSelectController{service: GetFormService()}
}

func (c *FormSelectController) SelectForm(w http.ResponseWriter, r *http.Request) {
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	formStr := r.URL.Query().Get("form")
	statuses := r.URL.Query().Get("statuses")

	page, limit := 1, 10

	//fmt.Printf("Получен запрос: page=%s, limit=%s, form=%s, statuses=%s\n", 
	//	pageStr, limitStr, formStr, statuses)

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	req := FormSelectPageRequest{
		Page:     page,
		Limit:    limit,
		Form:     formStr,
		Statuses: statuses,
	}

	forms, err := c.service.GetAll(&req)
	if err != nil {
		fmt.Printf("Ошибка загрузки форм: %v\n", err)
		http.Error(w, `{"error": "Не удалось загрузить формы"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(forms); err != nil {
		fmt.Printf("Ошибка кодирования ответа: %v\n", err)
	}
}

func (c *FormSelectController) GetFormByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, `{"error": "Неверный ID формы"}`, http.StatusBadRequest)
		return
	}

	form, err := c.service.GetByID(id)
	if err != nil {
		http.Error(w, `{"error": "Форма не найдена"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(form)
}
