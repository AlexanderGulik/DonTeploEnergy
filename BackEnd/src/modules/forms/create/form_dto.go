package form_create

type FormRequest struct {
	Type    string `json:"form_type" validate:"required"`
	Address string `json:"address" validate:"required"`
	Phone   string `json:"phone" validate:"required"`
	Data    string `json:"data" validate:"required"`
}
