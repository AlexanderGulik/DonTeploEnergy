package select_tariff

type TariffResponse struct {
	ID         int      `json:"id"`
	Period     string   `json:"period"`
	IsCurrent  bool     `json:"isCurrent"`
	Basis      string   `json:"basis"`
	Population []string `json:"population"`
	Budget     []string `json:"budget"`
}
