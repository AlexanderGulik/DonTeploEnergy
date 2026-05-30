package controller

import (
	"donTeploenergo/src/config" // Добавить этот импорт
	"donTeploenergo/src/modules/auth/admin/dto"
	"donTeploenergo/src/modules/auth/admin/service"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
)

type AdminAuthController struct {
	service *service.AdminAuthService
}

func NewAdminAuthController() *AdminAuthController {
	db := config.GetSqlDB()

	service := service.NewAdminAuthService(db)

	return &AdminAuthController{
		service: service,
	}
}

func (c *AdminAuthController) setRefreshTokenCookie(w http.ResponseWriter, refreshToken string) {
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

func (c *AdminAuthController) clearRefreshTokenCookie(w http.ResponseWriter) {
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

func (c *AdminAuthController) sendError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(dto.AdminErrorResponse{Message: message})
}

func (c *AdminAuthController) Login(w http.ResponseWriter, r *http.Request) {
	var req dto.AdminLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.sendError(w, "Неверный формат запроса", http.StatusBadRequest)
		return
	}

	admin, tokens, err := c.service.Login(&req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAdminInvalidInput):
			c.sendError(w, "Все поля обязательны", http.StatusBadRequest)
		case errors.Is(err, service.ErrAdminInvalidCredentials):
			c.sendError(w, "Неверное имя или пароль", http.StatusUnauthorized)
		default:
			c.sendError(w, "Ошибка сервера", http.StatusInternalServerError)
		}
		return
	}

	c.setRefreshTokenCookie(w, tokens.RefreshToken)

	response := dto.AdminLoginResponse{
		Message:     "Успешная авторизация",
		AccessToken: tokens.AccessToken,
		Admin: dto.AdminInfo{
			AdminID: admin.ID,
			Name:    admin.Name,
			Role:    admin.Role,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (c *AdminAuthController) Register(w http.ResponseWriter, r *http.Request) {
	var req dto.AdminRegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.sendError(w, "Неверный формат запроса", http.StatusBadRequest)
		return
	}

	_, tokens, err := c.service.Register(&req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAdminInvalidInput):
			c.sendError(w, "Проверьте введенные данные", http.StatusBadRequest)
		case errors.Is(err, service.ErrAdminUserExists):
			c.sendError(w, "Пользователь с таким именем уже существует", http.StatusBadRequest)
		default:
			fmt.Println(err)
			c.sendError(w, "Ошибка сервера", http.StatusInternalServerError)
		}
		return
	}

	c.setRefreshTokenCookie(w, tokens.RefreshToken)

	response := dto.AdminRegisterResponse{
		Message:      "Администратор успешно зарегистрирован",
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (c *AdminAuthController) RefreshToken(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		c.sendError(w, "Неверный Refresh Token", http.StatusBadRequest)
		return
	}

	accessToken, err := c.service.Refresh(cookie.Value)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAdminInvalidRefreshToken):
			c.sendError(w, "Неверный Refresh Token", http.StatusUnauthorized)
		case errors.Is(err, service.ErrAdminNotFound):
			c.sendError(w, "Администратор не найден", http.StatusNotFound)
		default:
			c.sendError(w, "Ошибка сервера", http.StatusInternalServerError)
		}
		return
	}

	response := dto.AdminRefreshResponse{
		AccessToken: accessToken,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (c *AdminAuthController) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err == nil {
		c.service.Logout(cookie.Value)
	}

	c.clearRefreshTokenCookie(w)

	response := dto.AdminLogoutResponse{
		Message: "Успешный выход из системы",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
