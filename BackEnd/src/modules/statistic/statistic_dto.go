package statistic

type DataResults struct {
	Total_users     int `db:"total_user" json:"total_user"`
	Total_forms     int `db:"total_forms" json:"total_forms"`
	Total_outages   int `db:"total_outages" json:"total_outages"`
	Total_tariffs   int `db:"total_tariffs" json:"total_tariffs"`
	Active_forms    int `db:"active_forms" json:"active_forms"`
	Completed_forms int `db:"completed_forms" json:"completed_forms"`
	Total_admins    int `db:"total_admins" json:"total_admins"`
	Active_admins   int `db:"active_admins" json:"active_admins"`
}

type TopResults struct {
	ID_user     int    `db:"id_user" json:"id_user"`
	FirstName   string `db:"firstname" json:"firstname"`
	LastName    string `db:"lastname" json:"lastname"`
	Email       string `db:"email" json:"email"`
	Total_forms int    `db:"total_forms" json:"total_forms"`
}

type FormsByDistrict struct {
	Id_district int    `db:"id_district" json:"id_district"`
	Name        string `db:"name" json:"name"`
	Forms_count int    `db:"forms_count" json:"forms_count"`
	Users_count int    `db:"users_count" json:"users_count"`
}

type FormsByType struct {
	Form_type string `db:"form_type" json:"form_type"`
	Count     int    `db:"count" json:"count"`
}

type OutagesByStatus struct {
	Status string `db:"status" json:"status"`
	Count  int    `db:"count" json:"count"`
}

type RecrentForms struct { 
	ID_form        int    `db:"id_form" json:"id_form"`
	Form_type      string `db:"form_type" json:"form_type"`
	Address        string `db:"address" json:"address"`
	Created_at     string `db:"created_at" json:"created_at"`
	Status         string `db:"status" json:"status"`
	User_firstname string `db:"user_firstname" json:"user_firstname"`
	User_lastname  string `db:"user_lastname" json:"user_lastname"`
}

type AdminStats struct {
	ID_admin        int    `db:"id_admin" json:"id_admin"`
	FIO            string `db:"fio" json:"fio"`
	Login          string `db:"login" json:"login"`
	Roles          string `db:"roles" json:"roles"`
	Processed_forms int   `db:"processed_forms" json:"processed_forms"`
	Active_forms    int   `db:"active_forms" json:"active_forms"`
	Last_activity   string `db:"last_activity" json:"last_activity"`
}

type AdminsPerfomence struct { 
	ID_admin           int    `db:"id_admin" json:"id_admin"`
	FIO               string `db:"fio" json:"fio"`
	Login             string `db:"login" json:"login"`
	Total_processed    int    `db:"total_processed" json:"total_processed"`
	Completed          int    `db:"completed" json:"completed"`
	Pending           int    `db:"pending" json:"pending"`
	Last_month_activity int   `db:"last_month_activity" json:"last_month_activity"`
}

type StatisticResponse struct {
	DataResults       DataResults         `json:"dataResults"`
	TopUsers          []TopResults        `json:"topUsers"`
	FormsByType       []FormsByType       `json:"formsByType"`
	FormsByDistrict   []FormsByDistrict   `json:"formsByDistrict"`
	OutagesByStatus   []OutagesByStatus   `json:"outagesByStatus"`
	RecrentForms      []RecrentForms       `json:"recentForms"`       
	AdminStats        []AdminStats        `json:"adminStats"`
	AdminsPerfomence []AdminsPerfomence `json:"adminsPerformance"` 
}
