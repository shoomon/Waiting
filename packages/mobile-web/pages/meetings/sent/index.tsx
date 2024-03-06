import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import styles from '@style/SentMeetings.module.css'

import { Confirm, Header, MeetingEdit, ModalPopup } from '@component'
import { useAxios } from '@hook'
import { useLoginContext } from '@context'
import { ROUTES, getFormattedDate } from '@util'
import { MeetingResponseDto, MeetingStatus } from '@api-type'

import { MeetingStatusLabel } from '../../../src/utils/consts'

const SentMeetings: React.FC = () => {
  const { me, isLoggedIn } = useLoginContext()
  const { api } = useAxios()
  const router = useRouter()
  const [meetings, setMeetings] = useState<MeetingResponseDto[]>([])
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [selectedMeetingId, setSelectedMeetingId] = useState<number>()
  const [editedContent, setEditedContent] = useState<string>('')

  const fetchMeetings = async () => {
    try {
      const response = (await api.meetings.getSentMeetings()) as any
      setMeetings(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleClosePopup = () => {
    setIsEditOpen(false)
    setIsDeleteOpen(false)
  }

  const handleClickEdit = (id: number, content: string) => {
    setSelectedMeetingId(id)
    setEditedContent(content)
    setIsEditOpen(!isEditOpen)
  }

  const handleEditMeeting = async () => {
    try {
      if (!selectedMeetingId) return
      if (!editedContent) {
        alert('미팅 내용을 입력해주세요.')
        return
      }

      const response = (await api.meetings.updateMeeting(selectedMeetingId, { content: editedContent })) as any

      if (response.data.id) {
        setIsEditOpen(false)
        fetchMeetings()
        alert('미팅 수정이 완료되었습니다.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleClickDelete = (id: number) => {
    setSelectedMeetingId(id)
    setIsDeleteOpen(!isDeleteOpen)
  }

  const handleDeleteMeeting = async () => {
    try {
      if (!selectedMeetingId) return

      const response = (await api.meetings.deleteMeeting(selectedMeetingId)) as any

      if (response.data) {
        setIsDeleteOpen(false)
        fetchMeetings()
        alert('미팅 삭제가 완료되었습니다.')
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
      <Header title="보낸 미팅" />
      <div className={styles.container}>
        <ModalPopup isOpen={isEditOpen || isDeleteOpen} onClose={handleClosePopup}>
          <div className={styles.popupContainer}>
            {isEditOpen && (
              <MeetingEdit
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                handleEditMeeting={handleEditMeeting}
              />
            )}
            {isDeleteOpen && <Confirm confirmLabel="미팅 삭제" onClickConfirm={handleDeleteMeeting} />}
          </div>
        </ModalPopup>
        {meetings?.map((meeting) => {
          const { id, createdAt, recipient, content, myWaitingNumber, status } = meeting
          return (
            <div key={id} className={styles.meetingItem}>
              <div className={styles.meetingInfo}>
                <div className={styles.recipientName}>{`${(recipient as any).name}님과의 미팅`}</div>
                <div className={styles.createdAt}>{`보낸시간: ${getFormattedDate(createdAt)}`}</div>
                <div className={styles.content}>{`내용: ${content}`}</div>
                {myWaitingNumber && <div className={styles.myWaitingNumber}>{`대기 순서: ${myWaitingNumber}`}</div>}
                <div className={styles.status}>{`상태: ${MeetingStatusLabel[status]}`}</div>
              </div>
              <div className={styles.buttons}>
                {status === MeetingStatus.PENDING && (
                  <>
                    <button className={styles.editButton} onClick={() => handleClickEdit(id, content)}>
                      수정
                    </button>
                    <button className={styles.deleteButton} onClick={() => handleClickDelete(id)}>
                      삭제
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

export default SentMeetings
