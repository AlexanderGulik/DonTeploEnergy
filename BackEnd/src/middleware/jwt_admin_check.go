package middleware

import (
	"context"
	"net/http"
	"strings"

	"donTeploenergo/src/utils"
	
)

type AdminContext struct {
	ID   int64
	Name string
	Role string
}

type contextKey string

const AdminKey contextKey = "admin"

func AdminAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]

		claims, err := utils.VerifyAdminAccessToken(tokenString)
		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		admin := AdminContext{
			ID:   claims.ID,
			Name: claims.Name,
			Role: claims.Role,
		}

		ctx := context.WithValue(r.Context(), AdminKey, admin)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
