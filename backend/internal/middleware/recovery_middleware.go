package middleware

import (
	"net/http"
	"runtime/debug"

	"github.com/Localapak/localapak-backend/pkg/logger"
	"github.com/Localapak/localapak-backend/pkg/response"
	"github.com/gin-gonic/gin"
)

// RecoveryMiddleware creates a recovery middleware that handles panics
func RecoveryMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				logger.Errorf("Panic recovered: %v\n%s", err, debug.Stack())
				response.Error(c, http.StatusInternalServerError, "Internal server error", nil)
				c.Abort()
			}
		}()

		c.Next()
	}
}
