import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import styles from '@style/FindPassword.module.css'

import { useAxios } from '@hook'
import { ROUTES } from '@util'

const FindPassword: React.FC = () => {
  const router = useRouter()
  const { api } = useAxios()

  const [email, setEmail] = useState('')
  const [isNotExistEmail, setIsNotExistEmail] = useState<boolean>(false)

  const [verificationCode, setVerificationCode] = useState<string>('')
  const [verificationLabel, setVerificationLabel] = useState<string>('확인')
  const [isVerificationCodeActivated, setIsVerificationCodeActivated] = useState<boolean>(false)
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isVerificationCodeMatch, setIsVerificationCodeMatch] = useState<boolean>(true)

  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true)
  const [isChangeActivated, setIsChangeActivated] = useState<boolean>(false)

  const handleSendVerificationCode = async () => {
    if (email && !isVerificationCodeSent) {
      try {
        setIsVerificationCodeSent(true)

        const response = (await api.auth.sendVerifyEmail(email, { isFind: true })) as any

        if (response.data) {
          setIsVerificationCodeActivated(true)
          setIsNotExistEmail(false)
          alert('인증 코드가 전송되었습니다.')
          setTimeout(() => {
            setIsVerificationCodeSent(false)
          }, 5000)
        }
      } catch (e: any) {
        if (e.error.statusCode === 404) setIsNotExistEmail(true)
        console.error(e)
        setIsVerificationCodeSent(false)
      }
    }
  }

  const handleCheckVerificationCode = async () => {
    setIsVerificationCodeMatch(true)

    try {
      const response = (await api.auth.verifyCode(email, verificationCode)) as any

      if (response.data) {
        setIsVerified(true)
        setIsVerificationCodeMatch(true)
        setVerificationLabel('완료')
      } else {
        setVerificationLabel('재시도')
        setIsVerificationCodeMatch(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleResetPassword = async () => {
    try {
      const response = (await api.users.resetPassword({ email, password })) as any

      if (response.data.id) {
        router.replace(ROUTES.Login)
        alert('비밀번호가 변경되었습니다.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (isVerified && password && confirmPassword) {
      if (password !== confirmPassword) {
        setIsPasswordMatch(false)
      } else {
        setIsPasswordMatch(true)
        setIsChangeActivated(true)
      }
    } else setIsChangeActivated(false)
  }, [confirmPassword, isVerified, password])

  return (
    <div className={styles['help-container']}>
      <h1>비밀번호 찾기</h1>
      <form>
        <div className={styles['form-group']}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isVerified}
          />
          {isNotExistEmail && <p className={styles['error-message']}>존재하지 않는 이메일 입니다.</p>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="verificationCode">이메일 인증코드</label>
          <div className={styles['verification-code-input']}>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={isVerified}
            />
            <button
              type="button"
              className={styles['verification-code-check']}
              onClick={handleCheckVerificationCode}
              disabled={!isVerificationCodeActivated || isVerified}
            >
              {verificationLabel}
            </button>
            <button
              type="button"
              className={styles['verification-code-send']}
              onClick={handleSendVerificationCode}
              disabled={isVerified || isVerificationCodeSent}
            >
              인증코드 전송
            </button>
          </div>
          {!isVerificationCodeMatch && <p className={styles['error-message']}>인증코드가 일치하지 않습니다.</p>}
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {!isPasswordMatch && <p className={styles['error-message']}>비밀번호가 일치하지 않습니다.</p>}
        </div>
        <button
          type="button"
          className={styles['help-button']}
          onClick={handleResetPassword}
          disabled={!isChangeActivated}
        >
          비밀번호 변경
        </button>
      </form>
    </div>
  )
}

export default FindPassword
