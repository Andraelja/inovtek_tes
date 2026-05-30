package dto

import "time"

type JobStatus string

const (
	JobStatusOpen   JobStatus = "open"
	JobStatusClosed JobStatus = "closed"
)

type CreateJobRequest struct {
	Title      string    `json:"title" binding:"required,min=2,max=200" example:"Frontend Engineer"`
	Department string    `json:"department" binding:"omitempty,max=100" example:"Engineering"`
	Status     JobStatus `json:"status" binding:"omitempty,oneof=open closed" example:"open"`
}

type JobResponse struct {
	ID         uint      `json:"id" example:"1"`
	Title      string    `json:"title" example:"Frontend Engineer"`
	Department string    `json:"department,omitempty" example:"Engineering"`
	Status     JobStatus `json:"status" example:"open"`
	CreatedAt  time.Time `json:"created_at" example:"2024-01-01T00:00:00Z"`
	UpdatedAt  time.Time `json:"updated_at" example:"2024-01-01T00:00:00Z"`
}

type DashboardStatsResponse struct {
	TotalJobs         int64 `json:"total_jobs" example:"10"`
	TotalCandidates   int64 `json:"total_candidates" example:"42"`
	TotalApplications int64 `json:"total_applications" example:"73"`
}

type PipelineStage string

const (
	PipelineApplied   PipelineStage = "applied"
	PipelineInterview PipelineStage = "interview"
	PipelineHired     PipelineStage = "hired"
)

type PipelineResponseItem struct {
	ApplicationID uint          `json:"application_id" example:"1"`
	JobID         uint          `json:"job_id" example:"1"`
	JobTitle      string        `json:"job_title" example:"Frontend Engineer"`
	CandidateName string        `json:"candidate_name" example:"Andi"`
	Stage         PipelineStage `json:"stage" example:"applied"`
	CreatedAt     time.Time     `json:"created_at" example:"2024-01-01T00:00:00Z"`
}

type PipelineResponse struct {
	Applied   []PipelineResponseItem `json:"applied"`
	Interview []PipelineResponseItem `json:"interview"`
	Hired     []PipelineResponseItem `json:"hired"`
}

type CreateApplicationRequest struct {
	JobID         uint          `json:"job_id" binding:"required" example:"1"`
	CandidateName string        `json:"candidate_name" binding:"required,min=2,max=100" example:"Andi"`
	Stage         PipelineStage `json:"stage" binding:"required,oneof=applied interview hired" example:"applied"`
}
