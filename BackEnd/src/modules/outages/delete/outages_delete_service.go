package delete_outages

import (
	"donTeploenergo/src/config"
)

type OutagesService struct{}

var outagesService *OutagesService

func DeleteOutagesService() *OutagesService {
	if outagesService == nil {
		outagesService = &OutagesService{}
	}
	return outagesService
}

func (s *OutagesService) DeleteOutages(id int) error {

	_, err := config.DB.Exec(`
        DELETE FROM outagesoff WHERE id_outages = $1
    `, id)
	return err
}
