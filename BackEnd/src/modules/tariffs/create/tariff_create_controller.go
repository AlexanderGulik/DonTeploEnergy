package create_tariff

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type TariffController struct {
	service *TariffService
}

func NewTariffCreatController() *TariffController {
	return &TariffController{service: CreateTariffService()}
}

func (c *TariffController) CreateTariff(w http.ResponseWriter, r *http.Request) {
	var req TariffRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": Ошибка сохранения"}`, http.StatusBadRequest)
		return
	}

	if err := c.service.CreateTariff(req); err != nil {
		log.Printf("Ошибка подключения к БД: %v", err)
		http.Error(w, `{"error": Ошибка сохранения"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	fmt.Println("Успешно добавлен новый тариф")
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Тариф добавлен."})
}
