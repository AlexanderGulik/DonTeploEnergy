package middleware

import (
	"net/http"
	"sync"
	"time"
)

type Attempt struct {
	count       int
	lastAttempt time.Time
}

var (
	attempts = make(map[string]*Attempt)
	mu       sync.RWMutex
)

func AuthLimiter(maxAttempts int, window time.Duration) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := r.RemoteAddr
			mu.RLock()
			attempt, exists := attempts[ip]
			mu.RUnlock()

			if exists {
				if time.Since(attempt.lastAttempt) > window {
					mu.Lock()
					delete(attempts, ip)
					mu.Unlock()
				} else if attempt.count >= maxAttempts {
					http.Error(w, `{"error": "Tooo many login attempts"}`, http.StatusTooManyRequests)
					return
				}
			}
			next.ServeHTTP(w, r)

		})
	}
}

func TrackLoginAttempts(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr

		mu.Lock()
		if attempts[ip] == nil {
			attempts[ip] = &Attempt{count: 0, lastAttempt: time.Now()}
		}
		attempts[ip].count++
		attempts[ip].lastAttempt = time.Now()
		mu.Unlock()
		next.ServeHTTP(w, r)
	})
}
