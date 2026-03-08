export interface ApiResponse<T> {
  data: T
  meta: {
    message: string
  }
}
