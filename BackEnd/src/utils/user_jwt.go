package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type UserAccessClaims struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type UserRefreshClaims struct {
	ID int64 `json:"id"`
	jwt.RegisteredClaims
}

func GenerateUserAccessToken(userID int64, email string) (string, error) {
	claims := UserAccessClaims{
		ID:    userID,
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func GenerateUserRefreshToken(userID int64) (string, error) {
	claims := UserRefreshClaims{
		ID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			//7 * 24 * time.Hour)
			IssuedAt: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("REFRESH_SECRET")))
}

func VerifyUserRefreshToken(tokenString string) (*UserRefreshClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserRefreshClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("REFRESH_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*UserRefreshClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}

func VerifyUserAccessToken(tokenString string) (*UserAccessClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserAccessClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*UserAccessClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}
