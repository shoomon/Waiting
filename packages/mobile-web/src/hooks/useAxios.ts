import { API_URL } from '../../config'
import { Api, ApiConfig, RequestParams } from '../../__generated__/Api'

type UseAxios = {
  api: Api<string>
  setAuthorization: (token: string) => void
}

const ApiConfig: ApiConfig<string> = {
  baseUrl: API_URL,
  baseApiParams: { secure: true, format: 'json' },
  securityWorker: (token: string | null): RequestParams =>
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {},
}

const api = new Api(ApiConfig)

export const useAxios = (): UseAxios => {
  const setAuthorization = (token: string) => {
    api.setSecurityData(token)
  }

  return {
    api,
    setAuthorization,
  }
}
