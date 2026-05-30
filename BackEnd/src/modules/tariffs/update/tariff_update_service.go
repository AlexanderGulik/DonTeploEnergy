package update_tariff

import (
	"donTeploenergo/src/config"
	"strings"
)

type TariffService struct{}

var tariffService *TariffService

func UpdateTariffService() *TariffService {
	if tariffService == nil {
		tariffService = &TariffService{}
	}
	return tariffService
}

func (s *TariffService) UpdateTariff(r TariffRequest, id int) error {
	populationStr := strings.Join(r.Population, "\n")
	budgetStr := strings.Join(r.Budget, "\n")
	_, err := config.DB.Exec(`
        Update tariffs SET period = $1, iscurrent = $2, basis = $3, population = $4, budget = $5 WHERE id_tariff = $6
    `, r.Period, r.IsCurrent, r.Basis, populationStr, budgetStr, id)
	return err
}
