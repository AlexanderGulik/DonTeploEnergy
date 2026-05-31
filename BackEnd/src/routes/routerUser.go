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
	"donTeploenergo/src/middleware"
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

	mux.HandleFunc("GET /api/applications", selectProfileCtrl.GetApplication)

	mux.HandleFunc("GET /api/districts", selectDistrictCtrl.GetAll)

	mux.HandleFunc("POST /api/forms/create", createFormCtrl.CreateForm)



	mux.HandleFunc("GET /api/tariffs", selectTariffCtrl.GetAll)
	mux.HandleFunc("GET /api/outages", selectOutagesCtrl.GetAll)

	mux.Handle("POST /api/user/form/chat/send",middleware.UserAuthMiddleware(http.HandlerFunc( createMessageCtrl.CreateMessageUser),))
	mux.Handle("GET /api/user/form/{id}/chat",middleware.UserAuthMiddleware(http.HandlerFunc( selectMessageCtrl.GetMessagesUser),))
	mux.Handle("POST /api/auth/change-password",middleware.UserAuthMiddleware(http.HandlerFunc( changePasswordCtrl.ChangePassword),))
	mux.Handle("PUT /api/auth/profile/update",middleware.UserAuthMiddleware(http.HandlerFunc( userUpdateCtrl.UpdateUserData),))
	mux.Handle("GET /api/auth/profile",middleware.UserAuthMiddleware(http.HandlerFunc( selectProfileCtrl.GetProfile),))

	//admin
	mux.Handle("POST /api/outages/create",middleware.AdminAuthMiddleware( http.HandlerFunc( createOutagesCtrl.CreateOutages),))
	mux.Handle("PUT /api/outages/update/{id}",middleware.AdminAuthMiddleware(http.HandlerFunc( updateOutagesCtrl.UpdateOutages), ))
	mux.Handle("DELETE /api/outages/delete/{id}",middleware.AdminAuthMiddleware(http.HandlerFunc(  deleteOutagesCtrl.DeleteOutages),))

	mux.Handle("POST /api/tariffs/create",middleware.AdminAuthMiddleware(http.HandlerFunc(createTariffCtrl.CreateTariff),))
	mux.Handle("PUT /api/tariffs/update/{id}", middleware.AdminAuthMiddleware(	
		http.HandlerFunc(updateTariffCtrl.UpdateTariff),
))
	mux.Handle("DELETE /api/tariffs/delete/{id}",middleware.AdminAuthMiddleware(http.HandlerFunc( deleteTariffCtrl.DeleteTariff),))
    mux.Handle("POST /api/admin/form/chat/send", middleware.AdminAuthMiddleware(
        http.HandlerFunc(createMessageCtrl.CreateMessage),
    ))
    mux.Handle("GET /api/admin/form/{id}/chat", middleware.AdminAuthMiddleware(
        http.HandlerFunc(selectMessageCtrl.GetMessages),
    ))
    mux.Handle("GET /api/admin/admin", middleware.AdminAuthMiddleware(
        http.HandlerFunc(selectAdminCtrl.SelectAdmin),
    ))
    mux.Handle("PUT /api/admin/admin/{id}", middleware.AdminAuthMiddleware(
        http.HandlerFunc(updateAdminCtrl.UpdateAdmin),
    ))
    mux.Handle("POST /api/admin/create", middleware.AdminAuthMiddleware(
        http.HandlerFunc(registerAdminCtrl.Register),
    ))
    mux.Handle("DELETE /api/admin/delete/{id}", middleware.AdminAuthMiddleware(
        http.HandlerFunc(deleteAdminCtrl.DeleteAdmin),
    ))
    mux.Handle("GET /api/admin/form", middleware.AdminAuthMiddleware(
        http.HandlerFunc(selectFormCtrl.SelectForm),
    ))
    mux.Handle("POST /api/admin/form/take", middleware.AdminAuthMiddleware(
        http.HandlerFunc(takeFormCtrl.TakeForm),
    ))
    mux.Handle("PUT /api/admin/form/update", middleware.AdminAuthMiddleware(
        http.HandlerFunc(updateFromCtrl.UpdateForm),
    ))
    mux.Handle("GET /api/admin/user", middleware.AdminAuthMiddleware(
        http.HandlerFunc(userCtrl.GetAll),
    ))
    mux.Handle("GET /api/admin/statistic", middleware.AdminAuthMiddleware(
        http.HandlerFunc(statisticCtrl.GetStatistic),
    ))


	mux.HandleFunc("POST /api/auth/refresh-admin", authAdminCtrl.RefreshToken)
	mux.HandleFunc("POST /api/auth/login", authAdminCtrl.Login)
	mux.HandleFunc("POST /api/auth/logout", authAdminCtrl.Logout)
	mux.HandleFunc("POST /api/auth/register", authAdminCtrl.Register)

	mux.HandleFunc("POST /api/auth/refresh-user", authUserCtrl.RefreshToken)
	mux.HandleFunc("POST /api/auth/login-user", authUserCtrl.Login)
	mux.HandleFunc("POST /api/auth/logout-user", authUserCtrl.Logout)
	mux.HandleFunc("POST /api/auth/register-user", authUserCtrl.Register)

	// Health check
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"status":"ok"}`))
	})
}
