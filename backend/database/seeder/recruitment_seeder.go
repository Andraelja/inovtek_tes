package database

import (
	"context"
	"math/rand"
	"time"

	"github.com/Localapak/localapak-backend/internal/entity"
	"gorm.io/gorm"
)

// SeedRecruitment seeds demo jobs + applications for dashboard.
func SeedRecruitment(ctx context.Context, db *gorm.DB) error {
	type jobSeed struct {
		Title      string
		Department string
		Status     entity.JobStatus
	}

	jobs := []jobSeed{
		{Title: "Frontend Engineer", Department: "Engineering", Status: entity.JobStatusOpen},
		{Title: "Backend Engineer", Department: "Engineering", Status: entity.JobStatusOpen},
		{Title: "Product Designer", Department: "Design", Status: entity.JobStatusOpen},
	}

	tc := rand.New(rand.NewSource(time.Now().UnixNano()))
	candidates := []string{"Andi", "Budi", "Citra", "Dewi", "Eko", "Fani", "Gilang", "Hana", "Ilham", "Juli"}

	stages := []entity.PipelineStage{entity.PipelineApplied, entity.PipelineInterview, entity.PipelineHired}

	// upsert jobs (by title)
	for _, js := range jobs {
		var existing entity.Job
		err := db.WithContext(ctx).Where("title = ?", js.Title).First(&existing).Error
		if err == nil {
			continue
		}
		if err != nil {
			if err != gorm.ErrRecordNotFound {
				return err
			}
			continue
		}

		job := &entity.Job{Title: js.Title, Department: js.Department, Status: js.Status}
		if err := db.WithContext(ctx).Create(job).Error; err != nil {
			return err
		}
	}

	// fetch jobs
	var allJobs []entity.Job
	if err := db.WithContext(ctx).Order("id asc").Find(&allJobs).Error; err != nil {
		return err
	}
	if len(allJobs) == 0 {
		return nil
	}

	// seed applications; avoid duplicates by (job_id, candidate_name)
	for i := 0; i < 18; i++ {
		job := allJobs[tc.Intn(len(allJobs))]
		cand := candidates[tc.Intn(len(candidates))]
		stage := stages[tc.Intn(len(stages))]

		var existing entity.Application
		err := db.WithContext(ctx).Where("job_id = ? AND candidate_name = ?", job.ID, cand).First(&existing).Error
		if err == nil {
			continue
		}
		if err != nil && err != gorm.ErrRecordNotFound {
			return err
		}

		app := &entity.Application{JobID: job.ID, CandidateName: cand, Stage: stage}
		if err := db.WithContext(ctx).Create(app).Error; err != nil {
			return err
		}
	}

	return nil
}
