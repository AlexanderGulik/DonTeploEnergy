package dto

type AdminLoginRequest struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type AdminRegisterRequest struct {
	Fio      string `json:"fio"`
	Name     string `json:"name"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type AdminLoginResponse struct {
	Message     string    `json:"message"`
	AccessToken string    `json:"accessToken"`
	Admin       AdminInfo `json:"admin"`
}

type AdminRegisterResponse struct {
	Message      string `json:"message"`
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type AdminRefreshResponse struct {
	AccessToken string `json:"accessToken"`
}

type AdminLogoutResponse struct {
	Message string `json:"message"`
}

type AdminErrorResponse struct {
	Message string `json:"message"`
}

type AdminInfo struct {
	AdminID int64  `json:"adminId"`
	Name    string `json:"name"`
	Role    string `json:"role"`
}

type AdminTokenPair struct {
	AccessToken  string
	RefreshToken string
}
