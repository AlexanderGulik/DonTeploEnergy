package create_admin

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type AdminController struct {
	service *AdminService
}

func NewAdminCreateController() *AdminController {
	return &AdminController{service: &CreateAdminService()}
}

func (c *AdminController) AdminCreate(w http.ResponseWriter, r *http.Request) {
	var req AdminRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "err"}`, http.StatusBadRequest)
		return
	}
	if err := c.service.CreateAdmin(req); err != nil {
		http.Error(w, `{"error": "err"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	fmt.Println("Успешно добавлен админ")
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Тариф добавлен"})
}
