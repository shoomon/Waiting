import React, { useState } from 'react'
import { useRouter } from 'next/router'

import styles from '@style/login.module.css'

import { useLoginContext } from '@context'
import { useAxios } from '@hook'
import { ROUTES } from '@util'

const Login: React.FC = () => {
  const router = useRouter()
  const { isLoggedIn, setLoginTokenCookie } = useLoginContext()
  const { api } = useAxios()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isNotExistEmail, setIsNotExistEmail] = useState<boolean>(false)
  const [isIncorrectPassword, setIsIncorrectPassword] = useState<boolean>(false)

  if (isLoggedIn) router.replace(ROUTES.Main)

  const handleLogin = async () => {
    try {
      const response = await api.auth.login({ email, password })
      const { token, expires } = (response?.data as any) || {}

      if (token) {
        setLoginTokenCookie?.(token, new Date(expires))
        router.replace(ROUTES.Main)
      }
    } catch (e: any) {
      if (e.error.statusCode === 401) {
        setPassword('')
        setIsIncorrectPassword(true)
      }
      if (e.error.statusCode === 404) {
        setEmail('')
        setPassword('')
        setIsNotExistEmail(true)
      }
      console.error(e)
    }
  }

  return (
    <div className={styles['login-container']}>
      <h1>로그인</h1>
      <form>
        <div className={styles['form-group']}>
          <label htmlFor="email">이메일</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setIsNotExistEmail(false)
            }}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setIsIncorrectPassword(false)
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') handleLogin()
            }}
          />
        </div>
        {isIncorrectPassword && <p className={styles['error-message']}>비밀번호를 잘못 입력했습니다.</p>}
        {isNotExistEmail && <p className={styles['error-message']}>존재하지 않는 이메일 입니다.</p>}
      </form>
      <div className={styles['form-group']}>
        <button type="button" className={styles['login-button']} onClick={handleLogin}>
          로그인
        </button>
        <button type="button" className={styles['signup-button']} onClick={() => router.push(ROUTES.Signup)}>
          회원가입
        </button>
        <div className={styles['find-password']} onClick={() => router.push(ROUTES.FindPassword)}>
          비밀번호 찾기
        </div>
      </div>
    </div>
  )
}

export default Login
