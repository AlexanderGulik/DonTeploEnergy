package delete_tariff

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type TariffController struct {
	service *TariffService
}

func NewTariffDeleteController() *TariffController {
	return &TariffController{service: DeleteTariffService()}
}

func (c *TariffController) DeleteTariff(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(r.URL.Path, "/")
	var idStr string
	for i := len(pathParts) - 1; i >= 0; i-- {
		if pathParts[i] != "" {
			idStr = pathParts[i]
			break
		}
	}
	if idStr == "" {
		http.Error(w, `{"error": "ID тарифа не указан"}`, http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		log.Printf("Ошибка преобразования ID: %v", err)
		http.Error(w, `{"error": "Неверный ID тарифа"}`, http.StatusBadRequest)
		return
	}

	if err := c.service.DeleteTariff(id); err != nil {
		log.Printf("Ошибка подключения к БД: %v", err)
		http.Error(w, `{"error": Ошибка сохранения"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	fmt.Println("Тариф успешно удален")
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Тариф удален."})
}
