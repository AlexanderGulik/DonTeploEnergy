package main

import (
	"log"
	"net/http"

	"donTeploenergo/src/config"
	"donTeploenergo/src/middleware"
	"donTeploenergo/src/routes"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Не удалось загрузить .env файл")
	}

	config.InitDB()
	defer config.DB.Close()

	mux := http.NewServeMux()

	routes.SetupUserRoutes(mux)

	handler := middleware.CorsMiddleware(mux)

	log.Println("Сервер запущен на :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}
