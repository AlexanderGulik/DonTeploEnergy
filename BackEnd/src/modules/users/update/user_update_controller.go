package update_user

import (
	"encoding/json"
	"fmt"
	"net/http"
	"donTeploenergo/src/utils"
	"log"
)

type UserDataUpdateController struct {
	service *UserUpdateService
}

func NewUserDataUpdateController() *UserDataUpdateController{
	return &UserDataUpdateController{service:UserDataUpdateService()}
}

func (c *UserDataUpdateController) UpdateUserData(w http.ResponseWriter, r *http.Request) {
	var req UserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"server": "error decode json"}`, http.StatusBadRequest)
		return
	}
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		fmt.Println("Auth false")
		http.Error(w, `{"server": "error auth"}`, http.StatusUnauthorized)
		return
	}
	userId, err := utils.ExtractAdminIDFromToken(authHeader)
	if err != nil {
		log.Println("Ошибка получения токена", err)
		http.Error(w, `{"server":"auth error"}`, http.StatusUnauthorized)
		return
	}
	 err = c.service.UpdateDataUser(req, userId) 
	 if err != nil {
		fmt.Println("error service", err)
		http.Error(w, `{"error": "error service"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Data update", "firstname": req.Firstname, "lastname": req.Lastname})
}


