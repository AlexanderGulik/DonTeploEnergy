package select_tariff

import (
	"encoding/json"
	"net/http"
)

type TariffController struct {
	service *TariffService
}

func NewTariffController() *TariffController {
	return &TariffController{service: GetTariffService()}
}

func (c *TariffController) GetAll(w http.ResponseWriter, r *http.Request) {
	tariffs, err := c.service.GetAll()
	if err != nil {
		http.Error(w, `{"error": "Не удалось загрузить тарифы"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tariffs)
}
