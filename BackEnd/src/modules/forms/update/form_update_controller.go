package update_form

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type FormController struct {
	service *FormService
}

func NewFormUpdateController() *FormController {
	return &FormController{service: FormUpdateService()}
}

func (c *FormController) UpdateForm(w http.ResponseWriter, r *http.Request) {
	var req FormUpdateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("Error decoding request: %v\n", err)
		http.Error(w, `{"error": "Invalid request format"}`, http.StatusBadRequest)
		return
	}

	fmt.Printf("Received request: formId=%d, formType='%s', status='%s', adminId=%d\n",
		req.FormID, req.FormType, req.Status, req.AdminID)

	if req.FormType == "" {
		fmt.Println("Error: formType is empty")
		http.Error(w, `{"error": "formType is required"}`, http.StatusBadRequest)
		return
	}

	if err := c.service.UpdateForm(req); err != nil {
		fmt.Printf("Error updating form: %v\n", err)
		http.Error(w, fmt.Sprintf(`{"error": "%v"}`, err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}
