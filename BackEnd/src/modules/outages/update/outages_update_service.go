package update_outages

import (
	"donTeploenergo/src/config"
	"log"
	"time"
)

type OutagesService struct{}

var outagesService *OutagesService

func UpdateOutagesService() *OutagesService {
	if outagesService == nil {
		outagesService = &OutagesService{}
	}
	return outagesService
}

func (s *OutagesService) UpdateOutages(r OutagesRequest, id int) error {

	t, err := time.Parse(time.RFC3339, r.Date)
	if err != nil {
		t, err = time.Parse("2006-01-02", r.Date)
		if err != nil {
			log.Printf("Ошибка парсинга даты %s: %v", r.Date, err)
			return err
		}
	}

	dateOnly := t.Format("2006-01-02")

	_, err = config.DB.Exec(`
        Update outagesoff SET adress = $1, date = $2, time = $3, reason = $4, status = $5 WHERE id_outages = $6
    `, r.Address, dateOnly, r.Time, r.Reason, r.Status, id)
	return err
}
