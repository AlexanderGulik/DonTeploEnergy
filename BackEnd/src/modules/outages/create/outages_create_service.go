package create_outages

import (
	"donTeploenergo/src/config"
	"log"
	"time"
)

type OutagesService struct{}

var outagesService *OutagesService

func CreateOutagesService() *OutagesService {
	if outagesService == nil {
		outagesService = &OutagesService{}
	}
	return outagesService
}

func (s *OutagesService) CreateOutages(r OutagesRequest, id_admin int64) error {
	t, err := time.Parse(time.RFC3339, r.Date)
	if err != nil {
		t, err = time.Parse("2006-01-02", r.Date)
		if err != nil {
			log.Printf("Ошибка парсинга даты %s: %v", r.Date, err)
			return err
		}
	}

	dateOnly := t.Format("2006-01-02")

	var newID int
	err = config.DB.QueryRow(`
        INSERT INTO outagesoff (id_admin, adress, date, time, reason, status)
        VALUES ($1, $2, $3::date, $4, $5, $6)
        RETURNING id_outages
    `, id_admin, r.Address, dateOnly, r.Time, r.Reason, r.Status).Scan(&newID)

	if err != nil {
		log.Printf("Ошибка вставки: %v", err)
		return err
	}

	log.Printf("Успешно создано отключение с ID: %d", newID)
	return nil
}
