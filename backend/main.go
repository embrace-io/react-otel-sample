package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"

	"github.com/embrace-io/react-otel-101/models"
	"github.com/embrace-io/react-otel-101/otel"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/plugin/opentelemetry/tracing"
)

func main() {
	// Handle SIGINT (CTRL+C) gracefully.
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	// Set up OpenTelemetry.
	otelShutdown, err := otel.SetupOTelSDK(ctx)
	if err != nil {
		return
	}
	// Handle shutdown properly so nothing leaks.
	defer func() {
		err = errors.Join(err, otelShutdown(context.Background()))
	}()

	db, err := gorm.Open(postgres.Open("host=db user=postgres password=postgres dbname=postgres port=5432 sslmode=disable TimeZone=UTC"))
	if err != nil {
		panic(err)
	}

	if err := db.Use(tracing.NewPlugin()); err != nil {
		panic(err)
	}

	r := gin.Default()
	r.Use(otelgin.Middleware("go-server"))
	r.Use(cors.Default())

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.GET("/products", func(c *gin.Context) {
		var products []models.Product

		result := db.WithContext(c.Request.Context()).Find(&products)

		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			return
		}

		c.JSON(http.StatusOK, products)
	})

	r.Run()
}
