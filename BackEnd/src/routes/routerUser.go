package routes

import (
	statisticCtrl "donTeploenergo/src/modules/statistic"
	deleteAdminCtrl "donTeploenergo/src/modules/admin/delete"
	selectAdminCtrl "donTeploenergo/src/modules/admin/select"
	updateAdminCtrl "donTeploenergo/src/modules/admin/update"

	authAdminCtrl "donTeploenergo/src/modules/auth/admin/controller"
	registerAdminCtrl "donTeploenergo/src/modules/auth/admin/controller"
	authUserCtrl "donTeploenergo/src/modules/auth/user/controller"

	createFormCtrl "donTeploenergo/src/modules/forms/create"
	selectFormCtrl "donTeploenergo/src/modules/forms/select"
	takeFormCtrl "donTeploenergo/src/modules/forms/take"
	updateFromCtrl "donTeploenergo/src/modules/forms/update"

	createMessageCtrl "donTeploenergo/src/modules/chat/create"
	selectMessageCtrl "donTeploenergo/src/modules/chat/select"

	createOutagesCtrl "donTeploenergo/src/modules/outages/create"
	deleteOutagesCtrl "donTeploenergo/src/modules/outages/delete"
	selectOutagesCtrl "donTeploenergo/src/modules/outages/select"
	updateOutagesCtrl "donTeploenergo/src/modules/outages/update"

	createTariffCtrl "donTeploenergo/src/modules/tariffs/create"
	deleteTariffCtrl "donTeploenergo/src/modules/tariffs/delete"
	selectTariffCtrl "donTeploenergo/src/modules/tariffs/select"
	updateTariffCtrl "donTeploenergo/src/modules/tariffs/update"

	selectDistrictCtrl "donTeploenergo/src/modules/districts/select"

	selectProfileCtrl "donTeploenergo/src/modules/profile/select"
	changePasswordCtrl "donTeploenergo/src/modules/profile/changePassword"
	updateUserCtrl "donTeploenergo/src/modules/users/update"

	userCtrl "donTeploenergo/src/modules/users/select"
	"net/http"
)

func SetupUserRoutes(mux *http.ServeMux) {
	statisticCtrl := statisticCtrl.NewStatisticController()
	changePasswordCtrl := changePasswordCtrl.NewChangePasswordController()
	userUpdateCtrl := updateUserCtrl.NewUserDataUpdateController()
	selectProfileCtrl := selectProfileCtrl.NewProfileSelectController()

	selectDistrictCtrl := selectDistrictCtrl.NewDistrictsController()

	createMessageCtrl := createMessageCtrl.NewMessageCreateController()
	selectMessageCtrl := selectMessageCtrl.NewChatController()

	createFormCtrl := createFormCtrl.NewFormController()

	selectTariffCtrl := selectTariffCtrl.NewTariffController()
	createTariffCtrl := createTariffCtrl.NewTariffCreatController()
	updateTariffCtrl := updateTariffCtrl.NewTariffUpdateController()
	deleteTariffCtrl := deleteTariffCtrl.NewTariffDeleteController()

	selectOutagesCtrl := selectOutagesCtrl.NewOutagesController()
	createOutagesCtrl := createOutagesCtrl.NewOutagesCreateController()
	updateOutagesCtrl := updateOutagesCtrl.NewOutagesUpdateController()
	deleteOutagesCtrl := deleteOutagesCtrl.NewOutagesDeleteController()

	authAdminCtrl := authAdminCtrl.NewAdminAuthController()
	authUserCtrl := authUserCtrl.NewUserAuthController()

	selectAdminCtrl := selectAdminCtrl.NewAdminSelectController()
	updateAdminCtrl := updateAdminCtrl.NewAdminUpdateController()
	deleteAdminCtrl := deleteAdminCtrl.NewAdminDeleteController()

	registerAdminCtrl := registerAdminCtrl.NewAdminAuthController()
	userCtrl := userCtrl.NewUserController()

	selectFormCtrl := selectFormCtrl.NewFormSelectController()
	takeFormCtrl := takeFormCtrl.NewFormTakeController()
	updateFromCtrl := updateFromCtrl.NewFormUpdateController()

	mux.HandleFunc("POST /api/auth/change-password", changePasswordCtrl.ChangePassword)
	mux.HandleFunc("PUT /api/auth/profile/update", userUpdateCtrl.UpdateUserData) 
	mux.HandleFunc("GET /api/auth/profile", selectProfileCtrl.GetProfile)
	mux.HandleFunc("GET /api/applications", selectProfileCtrl.GetApplication)

	mux.HandleFunc("GET /api/districts", selectDistrictCtrl.GetAll)

	mux.HandleFunc("POST /api/forms/create", createFormCtrl.CreateForm)

	mux.HandleFunc("POST /api/admin/form/chat/send", createMessageCtrl.CreateMessage)
	mux.HandleFunc("GET /api/admin/form/{id}/chat", selectMessageCtrl.GetMessages)

	mux.HandleFunc("POST /api/user/form/chat/send", createMessageCtrl.CreateMessageUser)
	mux.HandleFunc("GET /api/user/form/{id}/chat", selectMessageCtrl.GetMessagesUser)

	mux.HandleFunc("GET /api/tariffs", selectTariffCtrl.GetAll)
	mux.HandleFunc("POST /api/tariffs/create", createTariffCtrl.CreateTariff)
	mux.HandleFunc("PUT /api/tariffs/update/{id}", updateTariffCtrl.UpdateTariff)
	mux.HandleFunc("DELETE /api/tariffs/delete/{id}", deleteTariffCtrl.DeleteTariff)

	mux.HandleFunc("GET /api/outages", selectOutagesCtrl.GetAll)
	mux.HandleFunc("POST /api/outages/create", createOutagesCtrl.CreateOutages)
	mux.HandleFunc("PUT /api/outages/update/{id}", updateOutagesCtrl.UpdateOutages)
	mux.HandleFunc("DELETE /api/outages/delete/{id}", deleteOutagesCtrl.DeleteOutages)

	mux.HandleFunc("GET /api/admin/admin", selectAdminCtrl.SelectAdmin)
	mux.HandleFunc("PUT /api/admin/admin/{id}", updateAdminCtrl.UpdateAdmin)
	mux.HandleFunc("POST /api/admin/create", registerAdminCtrl.Register)
	mux.HandleFunc("DELETE /api/admin/delete/{id}", deleteAdminCtrl.DeleteAdmin)

	mux.HandleFunc("GET /api/admin/form", selectFormCtrl.SelectForm)
	mux.HandleFunc("POST /api/admin/form/take", takeFormCtrl.TakeForm)
	mux.HandleFunc("PUT /api/admin/form/update", updateFromCtrl.UpdateForm)

	mux.HandleFunc("GET /api/admin/user", userCtrl.GetAll)
	mux.HandleFunc("GET /api/admin/statistic", statisticCtrl.GetStatistic)

	mux.HandleFunc("POST /api/auth/login", authAdminCtrl.Login)
	mux.HandleFunc("POST /api/auth/logout", authAdminCtrl.Logout)
	mux.HandleFunc("POST /api/auth/register", authAdminCtrl.Register)

	mux.HandleFunc("POST /api/auth/login-user", authUserCtrl.Login)
	mux.HandleFunc("POST /api/auth/logout-user", authUserCtrl.Logout)
	mux.HandleFunc("POST /api/auth/register-user", authUserCtrl.Register)

	// Health check
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"status":"ok"}`))
	})
}
