package select_user

import (
	"encoding/json"
	"net/http"
	"strconv"
)

type UserController struct {
	service *UserService
}

func NewUserController() *UserController {
	return &UserController{service: GetUserService()}
}

func (c *UserController) GetAll(w http.ResponseWriter, r *http.Request) {

	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	id := 0
	if i, err := strconv.Atoi(r.URL.Query().Get("id")); err == nil {
		id = i
	}
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p < 0 {
			page = p
		}
	}

	limit := 10
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}
	req := &UserPageRequest{
		Page:  page,
		Limit: limit,
		ID:    id,
	}
	admin, err := c.service.GetAll(req)
	if err != nil {
		http.Error(w, `{"error": "Не удалось загрузить администраторов"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", " application/json")
	json.NewEncoder(w).Encode(admin)
}
