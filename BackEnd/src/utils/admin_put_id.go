package utils

import (
	"errors"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func ExtractAdminIDFromToken(tokenString string) (int64, error) {
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if id, ok := claims["id"]; ok {
			switch v := id.(type) {
			case float64:
				return int64(v), nil
			case int64:
				return v, nil
			case int:
				return int64(v), nil
			}
		}
	}

	return 0, errors.New("invalid token: no id claim found")
}
