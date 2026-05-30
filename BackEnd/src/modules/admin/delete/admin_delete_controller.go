package delete_admin

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

func NewAdminDeleteController() *AdminController {
	return &AdminController{service: AdminDeleteService()}
}

func (c *AdminController) DeleteAdmin(w http.ResponseWriter, r *http.Request) {
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
		http.Error(w, `{"error" "id trans err"}`, http.StatusInternalServerError)
		return
	}

	if err := c.service.DeleteAdmin(id); err != nil {
		http.Error(w, `{"error": "err"}`, http.StatusInternalServerError)

		return
	}
	fmt.Println("Delete confirm")
	json.NewEncoder(w).Encode(map[string]string{"status": "Success", "message": "delete confirm"})
}
