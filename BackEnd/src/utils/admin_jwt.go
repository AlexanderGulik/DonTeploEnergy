package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type AdminAccessClaims struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
	Role string `json:"role"`
	jwt.RegisteredClaims
}

type AdminRefreshClaims struct {
	ID int64 `json:"id"`
	jwt.RegisteredClaims
}

func GenerateAdminAccessToken(adminID int64, name, role string) (string, error) {
	claims := AdminAccessClaims{
		ID:   adminID,
		Name: name,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func GenerateAdminRefreshToken(adminID int64) (string, error) {
	claims := AdminRefreshClaims{
		ID: adminID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)), //
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("REFRESH_SECRET")))
}

func VerifyAdminRefreshToken(tokenString string) (*AdminRefreshClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &AdminRefreshClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("REFRESH_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*AdminRefreshClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}

func VerifyAdminAccessToken(tokenString string) (*AdminAccessClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &AdminAccessClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*AdminAccessClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}
