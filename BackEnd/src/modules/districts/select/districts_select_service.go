package select_districts

import (
	"donTeploenergo/src/config"
	"log"
)

type DistrictsService struct{}

var districtsService *DistrictsService

func getDistrictsService() *DistrictsService {
	if districtsService == nil {
		districtsService = &DistrictsService{}
	}
	return districtsService
}

func (s *DistrictsService) GetAll() ([]DistrictsResponse, error) {
	rows, err := config.DB.Queryx(`
		SELECT id_district, name FROM districts;
	`)
	if err != nil {
		log.Printf("Ошибка: %v", err)
		return nil, err
	}
	defer rows.Close()
	var result []DistrictsResponse
	for rows.Next() {
		var (
			id_district int
			name        string
		)
		err := rows.Scan(&id_district, &name)
		if err != nil {
			log.Printf("Ошибка 2: %v", err)
			return nil, err
		}
		districts := DistrictsResponse{
			ID:   id_district,
			NAME: name,
		}
		result = append(result, districts)
	}
	return result, nil
}
