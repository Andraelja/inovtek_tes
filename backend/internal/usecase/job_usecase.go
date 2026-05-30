package usecase

import (
	"context"

	"github.com/Localapak/localapak-backend/internal/dto"
	"github.com/Localapak/localapak-backend/internal/entity"
	"github.com/Localapak/localapak-backend/internal/repository"
)

type JobUseCase interface {
	CreateJob(ctx context.Context, req *dto.CreateJobRequest) (*dto.JobResponse, error)
	ListJobs(ctx context.Context, search string, status string) ([]dto.JobResponse, error)
	GetDashboardStats(ctx context.Context) (*dto.DashboardStatsResponse, error)
	GetPipeline(ctx context.Context) (*dto.PipelineResponse, error)
	CreateApplication(ctx context.Context, req *dto.CreateApplicationRequest) error
}

type jobUseCase struct {
	jobRepo repository.JobRepository
	appRepo repository.ApplicationRepository
}

func NewJobUseCase(jobRepo repository.JobRepository, appRepo repository.ApplicationRepository) JobUseCase {
	return &jobUseCase{jobRepo: jobRepo, appRepo: appRepo}
}

func (u *jobUseCase) CreateJob(ctx context.Context, req *dto.CreateJobRequest) (*dto.JobResponse, error) {
	status := dto.JobStatusOpen
	if req.Status != "" {
		status = req.Status
	}

	job := &entity.Job{
		Title:      req.Title,
		Department: req.Department,
		Status:     entity.JobStatus(status),
	}

	if err := u.jobRepo.Create(ctx, job); err != nil {
		return nil, err
	}

	return &dto.JobResponse{
		ID:         job.ID,
		Title:      job.Title,
		Department: job.Department,
		Status:     dto.JobStatus(job.Status),
		CreatedAt:  job.CreatedAt,
		UpdatedAt:  job.UpdatedAt,
	}, nil
}

func (u *jobUseCase) ListJobs(ctx context.Context, search string, status string) ([]dto.JobResponse, error) {
	jobs, err := u.jobRepo.List(ctx, search, status)
	if err != nil {
		return nil, err
	}

	resp := make([]dto.JobResponse, 0, len(jobs))
	for _, j := range jobs {
		resp = append(resp, dto.JobResponse{
			ID:         j.ID,
			Title:      j.Title,
			Department: j.Department,
			Status:     dto.JobStatus(j.Status),
			CreatedAt:  j.CreatedAt,
			UpdatedAt:  j.UpdatedAt,
		})
	}

	return resp, nil
}

func (u *jobUseCase) GetDashboardStats(ctx context.Context) (*dto.DashboardStatsResponse, error) {
	totalJobs, err := u.jobRepo.CountTotal(ctx)
	if err != nil {
		return nil, err
	}

	totalApps, err := u.appRepo.CountTotal(ctx)
	if err != nil {
		return nil, err
	}

	pipeline, err := u.appRepo.FindPipeline(ctx)
	if err != nil {
		return nil, err
	}

	seen := map[string]struct{}{}
	for _, a := range pipeline {
		seen[a.CandidateName] = struct{}{}
	}
	candidates := int64(len(seen))

	return &dto.DashboardStatsResponse{
		TotalJobs:         totalJobs,
		TotalCandidates:   candidates,
		TotalApplications: totalApps,
	}, nil
}

func (u *jobUseCase) GetPipeline(ctx context.Context) (*dto.PipelineResponse, error) {
	apps, err := u.appRepo.FindPipeline(ctx)
	if err != nil {
		return nil, err
	}

	applied := make([]dto.PipelineResponseItem, 0)
	interview := make([]dto.PipelineResponseItem, 0)
	hired := make([]dto.PipelineResponseItem, 0)

	for _, a := range apps {
		item := dto.PipelineResponseItem{
			ApplicationID: a.ID,
			JobID:         a.JobID,
			JobTitle:      "Job #" + itoa(a.JobID),
			CandidateName: a.CandidateName,
			Stage:         dto.PipelineStage(a.Stage),
			CreatedAt:     a.CreatedAt,
		}

		switch a.Stage {
		case entity.PipelineApplied:
			applied = append(applied, item)
		case entity.PipelineInterview:
			interview = append(interview, item)
		case entity.PipelineHired:
			hired = append(hired, item)
		}
	}

	return &dto.PipelineResponse{Applied: applied, Interview: interview, Hired: hired}, nil
}

func (u *jobUseCase) CreateApplication(ctx context.Context, req *dto.CreateApplicationRequest) error {
	app := &entity.Application{
		JobID:         req.JobID,
		CandidateName: req.CandidateName,
		Stage:         entity.PipelineStage(req.Stage),
	}
	return u.appRepo.Create(ctx, app)
}

func itoa(v uint) string {
	if v == 0 {
		return "0"
	}
	x := v
	buf := make([]byte, 0, 10)
	for x > 0 {
		d := x % 10
		buf = append([]byte{byte('0' + d)}, buf...)
		x /= 10
	}
	return string(buf)
}
