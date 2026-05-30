package entity

import "time"

type JobStatus string

const (
	JobStatusOpen   JobStatus = "open"
	JobStatusClosed JobStatus = "closed"
)

type Job struct {
	ID         uint       `json:"id" gorm:"primaryKey"`
	Title      string     `json:"title" gorm:"size:200;not null"`
	Department string     `json:"department,omitempty" gorm:"size:100"`
	Status     JobStatus  `json:"status" gorm:"size:20;not null;default:'open'"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
	DeletedAt  *time.Time `json:"-" gorm:"index"`
}

func (Job) TableName() string { return "jobs" }
