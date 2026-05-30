package select_admin

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

type AdminController struct {
	service *AdminService
}

func NewAdminSelectController() *AdminController {
	return &AdminController{service: SelectAdminService()}
}

func (c *AdminController) SelectAdmin(w http.ResponseWriter, r *http.Request) {
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	id := 0

	if i, err := strconv.Atoi(r.URL.Query().Get("id")); err == nil {
		id = i
	}
	fmt.Println("id admin", id)
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}
	limit := 10
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}
	req := &AdminPageRequest{
		Page:  page,
		Limit: limit,
		ID:    id,
	}

	admin, err := c.service.SelectAdmin(req)
	if err != nil {
		http.Error(w, `{"error": "Не удалось загрусить администраторов"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(admin)
}
