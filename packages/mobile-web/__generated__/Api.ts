/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface VerificationEmailDto {
  isFind: boolean
}

export interface LoginDto {
  /** 이메일 주소 */
  email: string
  /** 비밀번호 */
  password: string
}

export interface CreateUserDto {
  /** 이메일 주소 */
  email: string
  /** 비밀번호 */
  password: string
  /** 이름 */
  name: string
}

export interface LabeledDto {
  /** The value property of the labeled DTO */
  value: string
  /** The label property of the labeled DTO */
  label: string
}

export enum UserRole {
  REPORTER = 'REPORTER',
  RECIPIENT = 'RECIPIENT',
}

export interface UserResponseDto {
  id: number
  email: string
  name: string
  group: LabeledDto
  teams: LabeledDto[]
  role: UserRole
}

export interface UpdateUserDto {
  /** 이름 */
  name: string
  role: UserRole
  /** 팀 */
  teams: string[]
}

export interface ResetPasswordDto {
  /** 이메일 주소 */
  email: string
  /** 비밀번호 */
  password: string
}

export type User = object

export enum MeetingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
}

export interface MeetingResponseDto {
  id: number
  /** @format date-time */
  createdAt: string
  reporter: User
  recipient: User
  content: string
  myWaitingNumber: number
  status: MeetingStatus
}

export interface MeetingRequestDto {
  content: string
}

export interface MeetingStatusRequestDto {
  status: MeetingStatus
}

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = ''
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&')
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ''
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  }

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
    })
  }
}

/**
 * @title Waiting API
 * @version 1.0
 * @contact
 *
 * Rest API for Waiting
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description 이메일 인증코드 전송
     *
     * @tags auth
     * @name SendVerifyEmail
     * @request POST:/auth/email-verification/{email}
     */
    sendVerifyEmail: (email: string, data: VerificationEmailDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/email-verification/${email}`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 이메일 인증코드 확인
     *
     * @tags auth
     * @name VerifyCode
     * @request GET:/auth/email-verification/{email}/{code}
     */
    verifyCode: (email: string, code: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/email-verification/${email}/${code}`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description 로그인
     *
     * @tags auth
     * @name Login
     * @request POST:/auth/login
     */
    login: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/auth/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  users = {
    /**
     * @description 회원가입
     *
     * @tags users
     * @name CreateUser
     * @request POST:/users
     */
    createUser: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<UserResponseDto, any>({
        path: `/users`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description 회원정보 수정
     *
     * @tags users
     * @name UpdateUser
     * @request PATCH:/users
     * @secure
     */
    updateUser: (data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 비밀번호 변경
     *
     * @tags users
     * @name ResetPassword
     * @request PATCH:/users/reset/password
     */
    resetPassword: (data: ResetPasswordDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/reset/password`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  me = {
    /**
     * @description 내 정보 조회
     *
     * @tags me
     * @name GetMe
     * @request GET:/me
     * @secure
     */
    getMe: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/me`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  }
  teams = {
    /**
     * @description 팀원 조회
     *
     * @tags teams
     * @name GetTeammates
     * @request GET:/teams/mates
     * @secure
     */
    getTeammates: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/teams/mates`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 그룹의 팀 조회
     *
     * @tags teams
     * @name GetTeams
     * @request GET:/teams
     * @secure
     */
    getTeams: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/teams`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  }
  meetings = {
    /**
     * @description 보낸 Meeting 리스트 조회
     *
     * @tags meetings
     * @name GetSentMeetings
     * @request GET:/meetings/sent
     * @secure
     */
    getSentMeetings: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetings/sent`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 받은 Meeting 리스트 조회
     *
     * @tags meetings
     * @name GetReceivedMeetings
     * @request GET:/meetings/received
     * @secure
     */
    getReceivedMeetings: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetings/received`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description Meeting 조회
     *
     * @tags meetings
     * @name GetMeeting
     * @request GET:/meetings/{id}
     */
    getMeeting: (id: number, params: RequestParams = {}) =>
      this.request<MeetingResponseDto, any>({
        path: `/meetings/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Meeting 수정
     *
     * @tags meetings
     * @name UpdateMeeting
     * @request PUT:/meetings/{id}
     * @secure
     */
    updateMeeting: (id: number, data: MeetingRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetings/${id}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Meeting 삭제
     *
     * @tags meetings
     * @name DeleteMeeting
     * @request DELETE:/meetings/{id}
     * @secure
     */
    deleteMeeting: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetings/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Meeting 상태 변경
     *
     * @tags meetings
     * @name UpdateMeetingStatus
     * @request PATCH:/meetings/{id}
     * @secure
     */
    updateMeetingStatus: (id: number, data: MeetingStatusRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetings/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Meeting 생성
     *
     * @tags meetings
     * @name CreateMeeting
     * @request POST:/meetings/{recipientId}
     * @secure
     */
    createMeeting: (recipientId: number, data: MeetingRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetings/${recipientId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  }
}
