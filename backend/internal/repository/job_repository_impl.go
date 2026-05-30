package repository

import (
	"context"
	"strings"

	"github.com/Localapak/localapak-backend/internal/entity"
	"gorm.io/gorm"
)

type jobRepository struct {
	db *gorm.DB
}

func NewJobRepository(db *gorm.DB) JobRepository {
	return &jobRepository{db: db}
}

func (r *jobRepository) Create(ctx context.Context, job *entity.Job) error {
	return r.db.WithContext(ctx).Create(job).Error
}

func (r *jobRepository) List(ctx context.Context, search string, status string) ([]entity.Job, error) {
	var jobs []entity.Job

	q := r.db.WithContext(ctx).Model(&entity.Job{})

	if strings.TrimSpace(search) != "" {
		like := "%" + strings.ToLower(search) + "%"
		q = q.Where("lower(title) LIKE ? OR lower(department) LIKE ?", like, like)
	}

	if status != "" {
		q = q.Where("status = ?", status)
	}

	if err := q.Order("created_at desc").Find(&jobs).Error; err != nil {
		return nil, err
	}

	return jobs, nil
}

func (r *jobRepository) CountTotal(ctx context.Context) (int64, error) {
	var total int64
	if err := r.db.WithContext(ctx).Model(&entity.Job{}).Count(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

type applicationRepository struct {
	db *gorm.DB
}

func NewApplicationRepository(db *gorm.DB) ApplicationRepository {
	return &applicationRepository{db: db}
}

func (r *applicationRepository) Create(ctx context.Context, app *entity.Application) error {
	return r.db.WithContext(ctx).Create(app).Error
}

func (r *applicationRepository) CountTotal(ctx context.Context) (int64, error) {
	var total int64
	if err := r.db.WithContext(ctx).Model(&entity.Application{}).Count(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

func (r *applicationRepository) CountByStage(ctx context.Context, stage string) (int64, error) {
	var total int64
	if err := r.db.WithContext(ctx).Model(&entity.Application{}).Where("stage = ?", stage).Count(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

func (r *applicationRepository) FindPipeline(ctx context.Context) ([]entity.Application, error) {
	var apps []entity.Application
	if err := r.db.WithContext(ctx).Model(&entity.Application{}).Where("stage IN ?", []string{"applied", "interview", "hired"}).Order("created_at desc").Find(&apps).Error; err != nil {
		return nil, err
	}
	return apps, nil
}

// Ensure compile-time interface satisfaction
var _ JobRepository = (*jobRepository)(nil)
var _ ApplicationRepository = (*applicationRepository)(nil)
