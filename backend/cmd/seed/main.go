package main

import (
	"github.com/Localapak/localapak-backend/config"
	dbseeder "github.com/Localapak/localapak-backend/database/seeder"
	"github.com/Localapak/localapak-backend/internal/entity"
	"github.com/Localapak/localapak-backend/pkg/database"
	"github.com/Localapak/localapak-backend/pkg/logger"
)

func main() {
	// Initialize logger
	logger.InitLogger(true)
	logger.Info("Starting database seeder...")

	// Load configuration
	cfg, err := config.LoadConfig(".env")
	if err != nil {
		logger.Fatalf("Failed to load config: %v", err)
	}

	// Connect to database
	db, err := database.NewDatabase(&cfg.Database)
	if err != nil {
		logger.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Auto migrate
	if err := db.AutoMigrate(&entity.User{}); err != nil {
		logger.Fatalf("Failed to auto migrate: %v", err)
	}

	// Run seeder
	s := dbseeder.NewSeeder(db.DB)
	if err := s.Seed(); err != nil {
		logger.Fatalf("Failed to seed database: %v", err)
	}

	logger.Info("Database seeding completed successfully!")
}
