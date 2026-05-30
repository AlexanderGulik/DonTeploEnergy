package select_user

import "time"

type ResponseSelectUser struct {
	IDUser       int        `db:"id_user" json:"id_user"`
	Email        string     `db:"email" json:"email"`
	PasswordHash string     `db:"password_hash" json:"-"` // скрыто в JSON
	FirstName    string     `db:"firstname" json:"firstname"`
	LastName     *string    `db:"lastname" json:"lastname,omitempty"`
	Phone        *string    `db:"phone" json:"phone,omitempty"`
	District     string     `db:"district" json:"district"`
	Address      *string    `db:"address" json:"address,omitempty"`
	IsActive     bool       `db:"is_active" json:"is_active"`
	CreatedAt    time.Time  `db:"created_at" json:"created_at"`
	LastLogin    *time.Time `db:"last_login" json:"last_login,omitempty"`
	IDDistrict   *int       `db:"id_district" json:"id_district,omitempty"`
}

type UserPageRequest struct {
	ID    int `json "id_admin"`
	Page  int `json "page"`
	Limit int `json "limit"`
}
