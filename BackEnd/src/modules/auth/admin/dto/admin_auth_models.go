package dto

type AdminUserDB struct {
	ID       int64  `db:"id_admin"`
	Name     string `db:"login"`
	Password string `db:"passhash"`
	Role     string `db:"roles"`
}

type AdminRefreshTokenDB struct {
	ID      int64  `db:"id"`
	AdminID int64  `db:"id_admin"`
	token   string `db:"token"`
}

type SafeAdmin struct {
	ID   int64  `json:"id"`
	Name string `json:"login"`
	Role string `json:"role"`
}
