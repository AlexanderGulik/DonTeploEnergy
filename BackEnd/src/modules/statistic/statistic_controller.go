package statistic

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type StatisticController struct {
	service *StatisticService
}


func NewStatisticController() *StatisticController {
	return &StatisticController{service: GetStatisticService()}
}

func( c *StatisticController) GetStatistic (w http.ResponseWriter, r *http.Request) {
	
	statisticData, err := c.service.GetStatistic()
	if err != nil {
		fmt.Println("Ошибка получения статистики", err)
		http.Error(w, `{"error": "error get statistic"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(statisticData)
}

