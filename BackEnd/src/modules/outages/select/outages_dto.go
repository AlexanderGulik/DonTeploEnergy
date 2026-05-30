package select_outages

type OutagesResponse struct {
	ID      int    `json:"id"`
	Address string `json:"address"`
	Date    string `json:"date"`
	Time    string `json:"time"`
	Reason  string `json:"reason"`
	Status  string `json:"status"`
}
