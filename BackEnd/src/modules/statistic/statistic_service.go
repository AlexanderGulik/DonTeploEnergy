package statistic

import (
	"donTeploenergo/src/config"
	"fmt"
)

type StatisticService struct {}

var statisticService *StatisticService

func GetStatisticService() *StatisticService {
	if statisticService == nil {
		statisticService = &StatisticService{}
	}
	return statisticService
}

func (c *StatisticService) GetStatistic() (*StatisticResponse, error) {
	result := &StatisticResponse{}

	dataResults, err := SelectDataResults()
	if err != nil {
			fmt.Println("Error data result", err)
			return nil, fmt.Errorf("error getting user data %w", err)
	}
	result.DataResults = dataResults
	
	topResults, err := SelectTopResults()
	if err != nil {
		fmt.Println("Error top result",err)
		return nil, fmt.Errorf("error getting top result %w", err)
	}
	result.TopUsers = topResults

	formsByDistrict, err := SelectFormsByDistrict()
	if err != nil {
		fmt.Println("Error forms by district", err)
		return nil, fmt.Errorf("error getting forms by district %w", err)
	}
	result.FormsByDistrict = formsByDistrict

	formByType, err := SelectFormsByType()
	if err != nil {
		fmt.Println("Error form by type", err)
		return nil, fmt.Errorf("Error froms by type %w", err)
	}
	result.FormsByType = formByType
	
	outagesByStatus, err := SelectOutagesByStatus()
	if err != nil {
		fmt.Println("Error outages by status", err)
		return nil, fmt.Errorf("error getting outages by status %w", err)
	}
	result.OutagesByStatus = outagesByStatus
	recrentForms, err := SelectRecrentForms()
	if err != nil {
		fmt.Println("Error recrent froms", err)
		return nil, fmt.Errorf("error, recrent froms %w", err)
	}
	result.RecrentForms = recrentForms
	
	adminStats, err := SelectAdminStats()
	if err != nil {
		fmt.Println("Error admin stats", err)
		return nil, fmt.Errorf("error admin stats %w", err)
	}
	result.AdminStats = adminStats
	adminsPerfomence, err := SelectAdminsPerfomence()
	if err != nil {
		fmt.Println("Error admin perfomence", err)
		return nil, fmt.Errorf("error adminsPerfomence %w", err)
	}
	result.AdminsPerfomence = adminsPerfomence
		
	return result, nil
}

func  SelectDataResults() (DataResults, error) {
	var result DataResults
	dataQuery := `
	SELECT
		(SELECT COUNT(*) FROM users) AS total_user,
		(SELECT COUNT(*) FROM forms) AS total_forms,
		(SELECT COUNT(*) FROM outagesoff) AS total_outages,
		(SELECT COUNT(*) FROM tariffs) AS total_tariffs,
		(SELECT COUNT(*) FROM forms WHERE status = 'active') AS active_forms,
		(SELECT COUNT(*) FROM forms WHERE status = 'completed') as completed_forms,
    (SELECT COUNT(*) FROM adminusers) as total_admins,
    (SELECT COUNT(DISTINCT f.id_admin) 
  	FROM forms f 
  	WHERE f.id_admin IS NOT NULL 
  	AND f.updated_at >= CURRENT_DATE - INTERVAL '7 days') as active_admins
	`
	err := config.DB.QueryRowx(dataQuery).StructScan(&result)
    if err != nil {
        return result, fmt.Errorf("error scanning data results: %w", err)
    }

	return result, nil
}

func SelectTopResults() ([]TopResults, error) {
	var result []TopResults
	dataQuery := `
	SELECT
		u.id_user,
		u.firstname,
		u.lastname,
		u.email,
		COUNT(f.id_form) as total_forms
		FROM users u
		LEFT JOIN forms f ON u.id_user = f.id_user
		GROUP BY u.id_user, u.firstname, u.lastname, u.email
		ORDER BY total_forms DESC LIMIT 10
	`
	row, err := config.DB.Queryx(dataQuery)
	if err != nil {
		return nil, fmt.Errorf("error scanning top results: %w", err)
	}
	defer row.Close()
	for row.Next() {
		var top TopResults
		if err := row.StructScan(&top); err != nil {

		return nil, fmt.Errorf("error scanning top results: %w", err)
		}
		result = append(result, top)
	}
	return result, nil
}

func SelectFormsByDistrict() ([]FormsByDistrict, error) {
	var result []FormsByDistrict
	dataQuery := `
	SELECT
		d.id_district,
		d.name,
		COUNT(f.id_form) as forms_count,
		COUNT(DISTINCT u.id_user) as users_count
		FROM districts d
		LEFT JOIN users u ON d.id_district = u.id_district
		LEFT JOIN forms f ON u.id_user = f.id_user
		GROUP BY d.id_district, d.name
		ORDER BY forms_count DESC
	`
	rows, err := config.DB.Queryx(dataQuery)
	if err != nil {
		return  nil, fmt.Errorf("error scanning forms by district: %w", err)
	}
	defer rows.Close()
	for rows.Next(){
		var top FormsByDistrict
		if err := rows.StructScan(&top); err != nil {
			return  nil, fmt.Errorf("error scanning forms by district: %w", err)
		}
		result = append(result, top)
	}
	return result, nil
}

func SelectFormsByType() ([]FormsByType, error) {
	var result []FormsByType
	dataQuery := `
	SELECT
		form_type,
		COUNT(*) as count
		FROM forms
		GROUP BY form_type
		ORDER BY count DESC
	`

	rows, err := config.DB.Queryx(dataQuery)

	if err != nil {
		return nil, fmt.Errorf("error scanning forms by type: %w", err)
	}
	defer rows.Close()
	for rows.Next() {
		var top FormsByType
		if err := rows.StructScan(&top);  err != nil {
			return nil, fmt.Errorf("error scanning forms by type: %w", err)
		}
		result = append(result, top)
	}
	return result, nil
}

func SelectOutagesByStatus() ([]OutagesByStatus, error) {
	var result []OutagesByStatus
	dataQuery := `
	SELECT
		status,
		COUNT(*) as count
		FROM outagesoff
		GROUP BY status
		ORDER BY count DESC
	`
	rows, err := config.DB.Queryx(dataQuery)
	if err != nil {
		return nil, fmt.Errorf("error scanning outages: %w", err)
	}
	defer rows.Close()

	for rows.Next(){
		var top OutagesByStatus
		if err := rows.StructScan(&top); err != nil {
			return nil, fmt.Errorf("error scanning outages: %w", err)
		}
		result = append(result, top)
	}
	return result, nil
}

func SelectRecrentForms() ([]RecrentForms, error) {
	var result []RecrentForms
	dataQuery := `
	SELECT
		f.id_form,
		f.form_type,
		f.address,
		COALESCE(f.created_at::text, '') as created_at,
		f.status,
		u.firstname AS user_firstname,
		u.lastname AS user_lastname
		FROM forms f
		JOIN users u ON f.id_user = u.id_user
		ORDER BY f.created_at DESC NULLS LAST
		LIMIT 10
	`
	rows, err := config.DB.Queryx(dataQuery)
	if err != nil {
		return nil, fmt.Errorf("error recrent forms: %w", err)
	}
	defer rows.Close()	
	for rows.Next() {
		var top RecrentForms
		if err := rows.StructScan(&top); err != nil {
			return nil, fmt.Errorf("error recrent forms: %w", err)
		}
		result = append(result, top)
	}
	return result, nil
}

func SelectAdminStats() ([]AdminStats, error) {
	var result []AdminStats
	dataQuery := `
		SELECT 
		a.id_admin,
		a.fio,
		a.login,
		a.roles,
		COUNT(f.id_form) as processed_forms,
		COUNT(CASE WHEN f.status = 'active' THEN 1 END) as active_forms,
		COALESCE(MAX(f.updated_at)::text, '') as last_activity
		FROM adminusers a
		LEFT JOIN forms f ON a.id_admin = f.id_admin
		GROUP BY a.id_admin, a.fio, a.login, a.roles
		ORDER BY processed_forms DESC
	`
	rows, err := config.DB.Queryx(dataQuery)
	if err != nil {
		return nil, fmt.Errorf("error admin stats: %w", err)
	}
	defer rows.Close()
	for rows.Next(){
		var top AdminStats
		if err := rows.StructScan(&top); err != nil {
			return nil, fmt.Errorf("error admin stats: %w", err)
		}
		result = append(result, top)
	}
	return result, nil
}

func SelectAdminsPerfomence() ([]AdminsPerfomence, error) {
	var result []AdminsPerfomence
	dataQuery := `
	SELECT
		a.id_admin,
		a.fio,
		a.login,
		COUNT(f.id_form) AS total_processed,
		COUNT(CASE WHEN f.status = 'completed' THEN 1 END) as completed,
		COUNT(CASE WHEN f.status  IN ('active', 'pending') THEN 1 END) as pending,
		COUNT(CASE WHEN f.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as last_month_activity
		FROM adminusers a
		LEFT JOIN forms f ON a.id_admin = f.id_admin
		GROUP BY a.id_admin, a.fio, a.login
		ORDER BY total_processed DESC

	`
	rows, err := config.DB.Queryx(dataQuery)
	if err != nil {
		return nil, fmt.Errorf("error adminsPerfomence: %w", err)
	}
	defer rows.Close()
	for rows.Next(){
		var top AdminsPerfomence 
		if err := rows.StructScan(&top); err != nil {
			return nil, fmt.Errorf("error adminsPerfomence: %w", err)
		}
		result = append(result, top)
	}
	return result, nil
}
