package select_outages

import (
	"donTeploenergo/src/config"
	"log"
)

type OutagesService struct{}

var outagesService *OutagesService

func GetOutagesService() *OutagesService {
	if outagesService == nil {
		outagesService = &OutagesService{}
	}
	return outagesService
}

func (s *OutagesService) GetAll() ([]OutagesResponse, error) {
	rows, err := config.DB.Queryx(`
		SELECT id_outages, adress, date, time, reason, status from outagesoff ORDER BY date DESC;
	`)
	if err != nil {
		log.Printf("Ошибка подключения 1: %v", err)
		return nil, err
	}
	defer rows.Close()
	var result []OutagesResponse

	for rows.Next() {
		var (
			id_otages                          int
			adress, date, time, reason, status string
		)
		err := rows.Scan(&id_otages, &adress, &date, &time, &reason, &status)
		if err != nil {
			log.Printf("Ошибка подключения 2: %v", err)
			return nil, err
		}
		outages := OutagesResponse{
			ID:      id_otages,
			Address: adress,
			Date:    date,
			Time:    time,
			Reason:  reason,
			Status:  status,
		}
		result = append(result, outages)
	}
	return result, nil
}
