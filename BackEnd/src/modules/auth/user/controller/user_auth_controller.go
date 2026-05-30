package controller

import (
	"donTeploenergo/src/config" // Добавить этот импорт
	"donTeploenergo/src/modules/auth/user/dto"
	"donTeploenergo/src/modules/auth/user/service"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
)

type UserAuthController struct {
	service *service.UserAuthService
}

func NewUserAuthController() *UserAuthController {
	db := config.GetSqlDB()

	service := service.NewUserAuthService(db)

	return &UserAuthController{
		service: service,
	}
}

func (c *UserAuthController) setRefreshTokenCookie(w http.ResponseWriter, refreshToken string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		MaxAge:   7 * 24 * 60 * 60,
		HttpOnly: true,
		Secure:   os.Getenv("NODE_ENV") == "production",
		SameSite: http.SameSiteNoneMode,
		Path:     "/",
	})
}

func (c *UserAuthController) clearRefreshTokenCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   os.Getenv("NODE_ENV") == "production",
		SameSite: http.SameSiteNoneMode,
		Path:     "/",
	})
}

func (c *UserAuthController) sendError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(dto.UserErrorResponse{Message: message})
}

func (c *UserAuthController) Login(w http.ResponseWriter, r *http.Request) {
	var req dto.UserLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.sendError(w, "Неверный формат запроса", http.StatusBadRequest)
		return
	}

	user, tokens, err := c.service.Login(&req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUserInvalidInput):
			c.sendError(w, "Все поля обязательны", http.StatusBadRequest)
		case errors.Is(err, service.ErrUserInvalidCredentials):
			c.sendError(w, "Неверное имя или пароль", http.StatusUnauthorized)
		default:
			c.sendError(w, "Ошибка сервера", http.StatusInternalServerError)
		}
		return
	}

	c.setRefreshTokenCookie(w, tokens.RefreshToken)

	response := dto.UserLoginResponse{
		Message:     "Успешная авторизация",
		AccessToken: tokens.AccessToken,
		User: dto.UserInfo{
			UserID: user.ID,
			Email:  user.Email,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (c *UserAuthController) Register(w http.ResponseWriter, r *http.Request) {
	var req dto.UserRegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.sendError(w, "Неверный формат запроса", http.StatusBadRequest)
		return
	}

	_, tokens, err := c.service.Register(&req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUserInvalidInput):
			c.sendError(w, "Проверьте введенные данные", http.StatusBadRequest)
		case errors.Is(err, service.ErrUserExists):
			c.sendError(w, "Пользователь с таким именем уже существует", http.StatusBadRequest)
		default:
			fmt.Println(err)
			c.sendError(w, "Ошибка сервера", http.StatusInternalServerError)
		}
		return
	}

	c.setRefreshTokenCookie(w, tokens.RefreshToken)

	response := dto.UserRegisterResponse{
		Message:      "Пользователь успешно зарегистрирован",
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (c *UserAuthController) RefreshToken(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		c.sendError(w, "Необходима авторизация", http.StatusUnauthorized)
		return
	}

	tokens, err := c.service.Refresh(cookie.Value)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUserInvalidRefreshToken):
			c.sendError(w, "Неверный Refresh Token", http.StatusUnauthorized)
		case errors.Is(err, service.ErrUserNotFound):
			c.sendError(w, "Пользователь не найден", http.StatusNotFound)
		default:
			c.sendError(w, "Ошибка сервера", http.StatusInternalServerError)
		}
		return
	}

	c.setRefreshTokenCookie(w, tokens.RefreshToken)

	response := dto.UserRefreshResponse{
		AccessToken: tokens.AccessToken,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
func (c *UserAuthController) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err == nil {
		c.service.Logout(cookie.Value)
	}

	c.clearRefreshTokenCookie(w)

	response := dto.UserLogoutResponse{
		Message: "Успешный выход из системы",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
