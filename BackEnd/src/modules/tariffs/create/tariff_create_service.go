package create_tariff

import (
	"donTeploenergo/src/config"
	"strings"
)

type TariffService struct{}

var tariffService *TariffService

func CreateTariffService() *TariffService {
	if tariffService == nil {
		tariffService = &TariffService{}
	}
	return tariffService
}

func (s *TariffService) CreateTariff(r TariffRequest) error {
	populationStr := strings.Join(r.Population, "\n")
	budgetStr := strings.Join(r.Budget, "\n")
	_, err := config.DB.Exec(`
        INSERT INTO tariffs ( period, iscurrent, basis, population, budget)
        VALUES ($1, $2, $3, $4, $5)
    `, r.Period, r.IsCurrent, r.Basis, populationStr, budgetStr)
	return err
}
