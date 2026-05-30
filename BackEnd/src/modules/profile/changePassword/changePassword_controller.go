package change_password

import (
	"net/http"
	"fmt"
	"encoding/json"
	"donTeploenergo/src/utils"
)

type ChangePasswordController struct {
	service *ChangePassService
}

func NewChangePasswordController() *ChangePasswordController {
	return &ChangePasswordController{service: ChangePasswordService()}
}

func (c *ChangePasswordController) ChangePassword (w  http.ResponseWriter, r *http.Request) {
		var req ChangePasswordRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				fmt.Println("error decode", err)
				http.Error(w, `{"error": "error decode json"}`, http.StatusBadRequest)
				return
		}
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
				fmt.Println("error auth user change password")
				http.Error(w, `{"error": "auth error"}`, http.StatusUnauthorized)
				return
		}
		userId, err := utils.ExtractAdminIDFromToken(authHeader)
		if err != nil {
			fmt.Println(err)
			http.Error(w, `{"error": "error extract user id"}`, http.StatusUnauthorized)
			return
		}
		err = c.service.ChangePassword(req, userId)

		if err != nil {
			fmt.Println("error from service", err)
			http.Error(w, `{"error": "server error"}`, http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
}


