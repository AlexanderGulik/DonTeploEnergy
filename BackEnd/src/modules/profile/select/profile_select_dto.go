package select_profile

type ProfileResponse struct {
	FirstName string `json:"firstName" db:"firstname"`
	LastName  string `json:"lastName" db:"lastname"`
	Email     string `json:"email" db:"email"`
	District  string `json:"district" db:"name_district"`
	Address   string `json:"address" db:"address"`
	Phone     string `json:"phone" db:"phone"`
	Created   string `json:"created_at" db:"created_at"`
}

type ApplicationResponse struct {
	ID          string `json:"id" db:"id_form"`
	Type        string `json:"type" db:"form_type"`
	Address     string `json:"address" db:"address"`
	Description string `json:"description" db:"data"`
	Phone       string `json:"phone" db:"phone"`
	Status      string `json:"status" db:"status"`
	Created_at  string `json:"created_at" db:"created_at"`
	Updated_at  string `json:"updated_at" db:"updated_at"`
}

type PaginatedResponse struct {
	Data       []ApplicationResponse `json:"data"`
	Pagination struct {
		Page  int `json:"page"`
		Limit int `json:"limit"`
		Total int `json:"total"`
		Pages int `json:"pages"`
	} `json:"pagination"`
}
