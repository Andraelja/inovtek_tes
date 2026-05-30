export type Token = string

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data: T
}

