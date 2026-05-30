package update_admin

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

type AdminController struct {
	service *AdminService
}

func NewAdminUpdateController() *AdminController {
	return &AdminController{service: &AdminService{}}
}

func (c *AdminController) UpdateAdmin(w http.ResponseWriter, r *http.Request) {
	var req AdminRequest
	pathParts := strings.Split(r.URL.Path, "/")
	var idStr string
	for i := len(pathParts) - 1; i >= 0; i-- {
		if pathParts[i] != "" {
			idStr = pathParts[i]
			break
		}
	}
	if idStr == "" {
		http.Error(w, `{"error": "id err"}`, http.StatusBadRequest)
		return
	}
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, `{"error": "id trans err"}`, http.StatusBadRequest)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "err"}`, http.StatusBadRequest)
		return
	}

	if err := c.service.UpdateAdmin(req, id); err != nil {
		http.Error(w, `{"error": "err"}`, http.StatusInternalServerError)
	}
	fmt.Println("Update confirm")
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "update confirm"})
}
