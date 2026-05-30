package middleware

import (
	"net/http"
	"os"
	"fmt"
)

func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		frontAdminURL := os.Getenv("FRONT_ADMIN_URL")
		frontUserURL := os.Getenv("FRONT_USER_URL")
		fmt.Println("req")
		origin := r.Header.Get("Origin")
		if origin == frontAdminURL || origin == frontUserURL {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else if frontAdminURL == "" && frontUserURL == "" {
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Max-Age", "3600")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
