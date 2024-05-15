// types
import { AxiosError } from 'axios'
import { Request, Response } from '@/services/api/types'

function requestHandler<D, P = unknown, E = AxiosError>(request: Request<D, P>) {
  const call = async (params?: P): Promise<Response<D, E>> => {
    try {
      const { data } = await request(params)
      return { code: 'success', data }
    } catch (err) {
      console.error(err)
      return { code: 'error', error: err as E }
    }
  }

  return call
}

export { requestHandler }
