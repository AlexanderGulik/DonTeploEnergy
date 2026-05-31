package dto

type UserLoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserRegisterRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	District  int64  `json:"district"`
	Address   string `json:"address"`
	Phone     string `json:"phone"`
	Password  string `json:"password"`
}

type UserLoginResponse struct {
	Message     string      `json:"message"`
	AccessToken string      `json:"accessToken"`
	User        UserInfo    `json:"user"`
}

type UserRegisterResponse struct {
	Message      string `json:"message"`
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type UserRefreshResponse struct {
	AccessToken string `json:"accessToken"`
}

type UserLogoutResponse struct {
	Message string `json:"message"`
}

type UserErrorResponse struct {
	Message string `json:"message"`
}

type UserInfo struct {
	UserID    int64  `json:"userId"`
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
}

type UserTokenPair struct {
	AccessToken  string
	RefreshToken string
}

type UserDB struct {
	ID       int64
	Email    string
	Password string
	FirstName string
	LastName  string
	Phone     string
	Address   string
}
