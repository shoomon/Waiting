import { useState } from 'react'

import styles from '@style/TeammateDetail.module.css'

import { UserResponseDto, UserRole } from '@api-type'
import { useAxios } from '@hook'

type TeammateDetailProps = {
  teammate: UserResponseDto | null
  onClose: () => void
}

export const TeammateDetail = ({ teammate, onClose }: TeammateDetailProps) => {
  const [meetingContent, setMeetingContent] = useState<string>('')
  const { api } = useAxios()

  if (!teammate) return null

  const { id, name, email, teams, role } = teammate
  const isMeetingAvailable = role === UserRole.RECIPIENT

  const handleRequestMeeting = async () => {
    if (!meetingContent) {
      alert('미팅 내용을 입력해주세요.')
      return
    }
    try {
      const response = (await api.meetings.createMeeting(id, { content: meetingContent })) as any

      if (response.data?.id) {
        onClose()
        alert('미팅 신청이 완료되었습니다.')
      }
    } catch (e) {
      const errorCode = (e as any)?.error?.statusCode
      if (errorCode === 400) alert('상대방이 미팅 가능 상태가 아닙니다.')
      else if (errorCode === 404) alert('존재하지 않는 사용자입니다.')
      else if (errorCode === 409) alert(`금일 ${name}님과 완료되지 않은 미팅이 존재합니다.`)

      console.error(e)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles['form-group']}>
        <label>이름</label>
        <input type="text" value={name} disabled={true} />
      </div>
      <div className={styles['form-group']}>
        <label>Email</label>
        <input type="text" value={email} disabled={true} />
      </div>
      <div className={styles['form-group']}>
        <label>팀</label>
        {teams.map((team) => (
          <div key={team.value} className={styles.teamItem}>
            {team.label}
          </div>
        ))}
      </div>
      {isMeetingAvailable ? (
        <div className={styles['form-group']}>
          <label>미팅 내용</label>
          <input type="text" value={meetingContent} onChange={(e) => setMeetingContent(e.target.value)} />
        </div>
      ) : (
        <p className={styles['not-available-message']}>상대방이 미팅 가능 상태가 아닙니다.</p>
      )}
      <button onClick={handleRequestMeeting} className={styles.button} disabled={!isMeetingAvailable}>
        미팅 신청
      </button>
    </div>
  )
}
