package repository

import (
	"context"

	"github.com/Localapak/localapak-backend/internal/entity"
)

type JobRepository interface {
	Create(ctx context.Context, job *entity.Job) error
	List(ctx context.Context, search string, status string) ([]entity.Job, error)
	CountTotal(ctx context.Context) (int64, error)
}

type ApplicationRepository interface {
	Create(ctx context.Context, app *entity.Application) error
	CountTotal(ctx context.Context) (int64, error)
	CountByStage(ctx context.Context, stage string) (int64, error)
	FindPipeline(ctx context.Context) ([]entity.Application, error)
}
