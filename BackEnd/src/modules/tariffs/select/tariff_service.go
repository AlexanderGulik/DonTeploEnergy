package select_tariff

import (
	"donTeploenergo/src/config"
	"log"
	"strings"
)

type TariffService struct{}

var tariffService *TariffService

func GetTariffService() *TariffService {
	if tariffService == nil {
		tariffService = &TariffService{}
	}
	return tariffService
}

func (s *TariffService) GetAll() ([]TariffResponse, error) {
	rows, err := config.DB.Queryx(`
        SELECT id_tariff, period, iscurrent, basis, population, budget 
        FROM tariffs 
        ORDER BY id_tariff 
    `)
	if err != nil {
		log.Printf("Ошибка подключения 1: %v", err)
		return nil, err
	}
	defer rows.Close()

	var result []TariffResponse

	for rows.Next() {
		var (
			id_tariff                               int
			period, basis, populationStr, budgetStr string
			iscurrent                               bool
		)

		err := rows.Scan(&id_tariff, &period, &iscurrent, &basis, &populationStr, &budgetStr)
		if err != nil {
			log.Printf("Ошибка подключения 2: %v", err)
			return nil, err
		}

		tariff := TariffResponse{
			ID:         id_tariff,
			Period:     period,
			IsCurrent:  iscurrent,
			Basis:      basis,
			Population: splitLines(populationStr),
			Budget:     splitLines(budgetStr),
		}
		result = append(result, tariff)
	}
	return result, nil
}

func splitLines(s string) []string {
	if s == "" {
		return []string{}
	}
	lines := strings.Split(strings.TrimSpace(s), "\n")
	var clean []string
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if trimmed != "" {
			clean = append(clean, trimmed)
		}
	}
	return clean
}
