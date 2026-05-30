package select_districts

type DistrictsResponse struct {
	ID   int    `json:"id_district" db:"id_district"`
	NAME string `json:"name" db:"name"`
}
