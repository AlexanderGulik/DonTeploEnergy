package delete_tariff

import (
	"donTeploenergo/src/config"
)

type TariffService struct{}

var tariffService *TariffService

func DeleteTariffService() *TariffService {
	if tariffService == nil {
		tariffService = &TariffService{}
	}
	return tariffService
}

func (s *TariffService) DeleteTariff(id int) error {
	_, err := config.DB.Exec(`
        DELETE FROM tariffs WHERE id_tariff = $1    `, id)
	return err
}
