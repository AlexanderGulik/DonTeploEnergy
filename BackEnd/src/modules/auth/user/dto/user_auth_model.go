package dto

type AdminRefreshTokenDB struct {
	ID     int64  `db:"id"`
	UserID int64  `db:"id_user"`
	token  string `db:"token"`
}

type SafeUser struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
}
