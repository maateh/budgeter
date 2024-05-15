import { AxiosError, AxiosResponse } from "axios"
import { FilterOptions, PaginationParams, Sort } from "@/services/api/types"

export type QueryOptions<T> = {
  params?: PaginationParams
  filter?: FilterOptions<T>
  sortBy?: Sort
}

export type Request<D, P = unknown> = (params?: P) => Promise<AxiosResponse<D>>

export type SuccessResponse<D> = {
  code: 'success'
  data: D
}

export type ErrorResponse<E = AxiosError> = {
  code: 'error'
  error: E
}

export type Response<D, E = AxiosError> = SuccessResponse<D> | ErrorResponse<E>
