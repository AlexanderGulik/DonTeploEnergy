package update_outages

type OutagesRequest struct {
	Address string `json:"address"`
	Date    string `json:"date"`
	Time    string `json:"time"`
	Reason  string `json:"reason"`
	Status  string `json:"status"`
}
