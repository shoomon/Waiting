import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import styles from '@style/ReceivedMeetings.module.css'

import { Confirm, Header, ModalPopup } from '@component'
import { useAxios } from '@hook'
import { useLoginContext } from '@context'
import { ROUTES, getFormattedDate } from '@util'
import { MeetingResponseDto, MeetingStatus } from '@api-type'

import { MeetingStatusLabel } from '../../../src/utils/consts'

const ReceivedMeetings: React.FC = () => {
  const { me, isLoggedIn } = useLoginContext()
  const { api } = useAxios()
  const router = useRouter()
  const [meetings, setMeetings] = useState<MeetingResponseDto[]>([])
  const [selectedMeetingId, setSelectedMeetingId] = useState<number>()
  const [isAcceptOpen, setIsAcceptOpen] = useState<boolean>(false)
  const [isRefuseOpen, setIsRefuseOpen] = useState<boolean>(false)

  const fetchMeetings = async () => {
    try {
      const response = (await api.meetings.getReceivedMeetings()) as any
      setMeetings(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleClick = (id: number, status: MeetingStatus) => {
    setSelectedMeetingId(id)
    if (status === MeetingStatus.ACCEPTED) setIsAcceptOpen(!isAcceptOpen)
    if (status === MeetingStatus.REFUSED) setIsRefuseOpen(!isRefuseOpen)
  }

  const handleClosePopup = () => {
    setIsAcceptOpen(false)
    setIsRefuseOpen(false)
  }

  const updateMeetingStatus = async (status: MeetingStatus) => {
    try {
      if (!selectedMeetingId) return
      const response = (await api.meetings.updateMeetingStatus(selectedMeetingId, { status })) as any

      if (response.data.id) {
        const status = response.data.status as MeetingStatus
        const statusLabel = MeetingStatusLabel[status]
        handleClosePopup()
        fetchMeetings()
        alert(`미팅이 ${statusLabel}되었습니다.`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchMeetings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me])

  useEffect(() => {
    if (!isLoggedIn) router.replace(ROUTES.Login)
  }, [isLoggedIn, router])

  return (
    <>
      <Header title="받은 미팅" />
      <div className={styles.container}>
        <ModalPopup isOpen={isAcceptOpen || isRefuseOpen} onClose={handleClosePopup}>
          <div className={styles.popupContainer}>
            {isAcceptOpen && (
              <Confirm confirmLabel="미팅 승인" onClickConfirm={() => updateMeetingStatus(MeetingStatus.ACCEPTED)} />
            )}
            {isRefuseOpen && (
              <Confirm confirmLabel="미팅 거절" onClickConfirm={() => updateMeetingStatus(MeetingStatus.REFUSED)} />
            )}
          </div>
        </ModalPopup>
        {meetings?.map((meeting) => {
          const { id, createdAt, reporter, content, myWaitingNumber, status } = meeting
          return (
            <div key={id} className={styles.meetingItem}>
              <div className={styles.meetingInfo}>
                <div className={styles.recipientName}>{`${(reporter as any).name}님이 요청한 미팅`}</div>
                <div className={styles.createdAt}>{`보낸시간: ${getFormattedDate(createdAt)}`}</div>
                <div className={styles.content}>{`내용: ${content}`}</div>
                {myWaitingNumber && <div className={styles.myWaitingNumber}>{`대기 순서: ${myWaitingNumber}`}</div>}
                <div className={styles.status}>{`상태: ${MeetingStatusLabel[status]}`}</div>
              </div>
              <div className={styles.buttons}>
                {status === MeetingStatus.PENDING && (
                  <>
                    <button className={styles.acceptButton} onClick={() => handleClick(id, MeetingStatus.ACCEPTED)}>
                      승인
                    </button>
                    <button className={styles.refuseButton} onClick={() => handleClick(id, MeetingStatus.REFUSED)}>
                      거절
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default ReceivedMeetings
