package update_tariff

type TariffRequest struct {
	Period     string   `json:"period"`
	IsCurrent  bool     `json:"isCurrent"`
	Basis      string   `json:"basis"`
	Population []string `json:"population"`
	Budget     []string `json:"budget"`
}
