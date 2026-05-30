package select_districts

import (
	"encoding/json"
	"net/http"
)

type DistrictsController struct {
	service *DistrictsService
}

func NewDistrictsController() *DistrictsController {
	return &DistrictsController{service: getDistrictsService()}
}

func (c DistrictsController) GetAll(w http.ResponseWriter, r *http.Request) {
	districts, err := c.service.GetAll()
	if err != nil {
		http.Error(w, `{"error": "Не удалось загрузить районы"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(districts)
}
