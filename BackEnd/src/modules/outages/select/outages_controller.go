package select_outages

import (
	"encoding/json"
	"net/http"
)

type OutagesController struct {
	service *OutagesService
}

func NewOutagesController() *OutagesController {
	return &OutagesController{service: GetOutagesService()}
}

func (c *OutagesController) GetAll(w http.ResponseWriter, r *http.Request) {
	outages, err := c.service.GetAll()
	if err != nil {
		http.Error(w, `{"error": "Не удалось загрузить ремонтые работы"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(outages)
}
