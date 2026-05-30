package handler

import (
	"net/http"
	"strconv"

	"github.com/Localapak/localapak-backend/internal/dto"
	"github.com/Localapak/localapak-backend/internal/usecase"
	"github.com/Localapak/localapak-backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type JobHandler struct {
	jobUseCase usecase.JobUseCase
}

func NewJobHandler(jobUseCase usecase.JobUseCase) *JobHandler {
	return &JobHandler{jobUseCase: jobUseCase}
}

// CreateJob godoc
// @Summary Create a new job
// @Description Add a job to the system
// @Tags Jobs
// @Accept json
// @Produce json
// @Param request body dto.CreateJobRequest true "Create job request"
// @Success 201 {object} response.Response{data=dto.JobResponse}
// @Failure 400 {object} response.Response
// @Router /api/v1/jobs [post]
func (h *JobHandler) CreateJob(c *gin.Context) {
	var req dto.CreateJobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	job, err := h.jobUseCase.CreateJob(c.Request.Context(), &req)

	if err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.Success(c, "Job created successfully", job)
}

// ListJobs godoc
// @Summary List jobs
// @Description List jobs with optional search and status filter
// @Tags Jobs
// @Accept json
// @Produce json
// @Param search query string false "Search keyword"
// @Param status query string false "Job status: open|closed"
// @Success 200 {object} response.Response{data=[]dto.JobResponse}
// @Failure 400 {object} response.Response
// @Router /api/v1/jobs [get]
func (h *JobHandler) ListJobs(c *gin.Context) {
	search := c.Query("search")
	status := c.Query("status")

	jobs, err := h.jobUseCase.ListJobs(c.Request.Context(), search, status)
	if err != nil {
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, "Jobs retrieved successfully", jobs)
}

// DashboardStats godoc
// @Summary Dashboard stats
// @Description Return total jobs, candidates and applications
// @Tags Dashboard
// @Accept json
// @Produce json
// @Success 200 {object} response.Response{data=dto.DashboardStatsResponse}
// @Router /api/v1/dashboard/stats [get]
func (h *JobHandler) DashboardStats(c *gin.Context) {
	if h == nil || h.jobUseCase == nil {
		response.InternalServerError(c, "jobUseCase is not initialized")
		return
	}

	stats, err := h.jobUseCase.GetDashboardStats(c.Request.Context())
	if err != nil {
		// Return raw error message to make FE not mask auth issues with generic 500.
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, "Dashboard stats retrieved successfully", stats)
}

// Pipeline godoc
// @Summary Candidate pipeline
// @Description Return pipeline board grouped by stage
// @Tags Dashboard
// @Accept json
// @Produce json
// @Success 200 {object} response.Response{data=dto.PipelineResponse}
// @Router /api/v1/pipeline [get]
func (h *JobHandler) Pipeline(c *gin.Context) {
	pipeline, err := h.jobUseCase.GetPipeline(c.Request.Context())
	if err != nil {
		response.InternalServerError(c, err.Error())
		return
	}
	response.Success(c, "Pipeline retrieved successfully", pipeline)
}

// CreateApplication godoc
// @Summary Create application
// @Description Create a candidate application for a job
// @Tags Dashboard
// @Accept json
// @Produce json
// @Param request body dto.CreateApplicationRequest true "Create application request"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /api/v1/applications [post]
func (h *JobHandler) CreateApplication(c *gin.Context) {
	var req dto.CreateApplicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	if req.JobID == 0 {
		response.BadRequest(c, "job_id is required", nil)
		return
	}

	if err := h.jobUseCase.CreateApplication(c.Request.Context(), &req); err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	c.JSON(http.StatusCreated, response.Response{Success: true, Message: "Application created successfully"})
}

// helper to avoid unused import warnings when building incrementally
var _ = strconv.Itoa
