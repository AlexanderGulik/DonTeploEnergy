package select_profile

import (
	"donTeploenergo/src/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

type ProfileSelectController struct {
	service *ProfileService
}

func NewProfileSelectController() *ProfileSelectController {
	return &ProfileSelectController{service: GetProfileService()}
}

func (c *ProfileSelectController) GetProfile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("GetProfile")
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		fmt.Println("Требуется авторизация")
		http.Error(w, `{"error": "Требуется авторизация"}`, http.StatusUnauthorized)
		return
	}

	userID, err := utils.ExtractAdminIDFromToken(authHeader)
	//fmt.Println("Extracted user ID:", userID)
	//fmt.Println("Error extracting:", err)

	if err != nil {
		log.Printf("Ошибка извлечения ID Пользователя: %v", err)
		http.Error(w, `{"error": "Недействительный токен"}`, http.StatusUnauthorized)
		return
	}

	profileData, err := c.service.GetProfile(userID)
	//fmt.Println("Profile data:", profileData) // Отладка
	//fmt.Println("Profile error:", err)        // Отладка

	if err != nil {
		log.Printf("Ошибка получения профиля: %v", err)
		http.Error(w, `{"error": "Ошибка получения профиля"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(profileData)
}

func (c *ProfileSelectController) GetApplication(w http.ResponseWriter, r *http.Request) {
	fmt.Println("GetApp")
	pageStr := r.URL.Query().Get("page")
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		fmt.Println("Требуется авторизация")
		http.Error(w, `{"error": "Требуется авторизация"}`, http.StatusUnauthorized)
		return
	}

	userID, err := utils.ExtractAdminIDFromToken(authHeader)
	fmt.Println("Extracted user ID:", userID)
	fmt.Println("Error extracting:", err)

	if err != nil {
		log.Printf("Ошибка извлечения ID Пользователя: %v", err)
		http.Error(w, `{"error": "Недействительный токен"}`, http.StatusUnauthorized)
		return
	}
	pageInt := 1
	if pageStr != "" {
		pageInt, err = strconv.Atoi(pageStr)
		if err != nil {
			pageInt = 1
		}
	}

	applicationData, err := c.service.GetApplication(userID, pageInt)

	if err != nil {
		log.Printf("Ошибка получения заявок: %v", err)
		http.Error(w, `{"error": "Ошибка получения профиля"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(applicationData)

}
