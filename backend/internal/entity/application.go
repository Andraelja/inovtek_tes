package entity

import "time"

type PipelineStage string

const (
	PipelineApplied   PipelineStage = "applied"
	PipelineInterview PipelineStage = "interview"
	PipelineHired     PipelineStage = "hired"
)

type Application struct {
	ID            uint          `json:"id" gorm:"primaryKey"`
	JobID         uint          `json:"job_id" gorm:"not null;index"`
	CandidateName string        `json:"candidate_name" gorm:"size:100;not null"`
	Stage         PipelineStage `json:"stage" gorm:"size:20;not null"`
	CreatedAt     time.Time     `json:"created_at"`
	UpdatedAt     time.Time     `json:"updated_at"`
	DeletedAt     *time.Time    `json:"-" gorm:"index"`
}

func (Application) TableName() string { return "applications" }
