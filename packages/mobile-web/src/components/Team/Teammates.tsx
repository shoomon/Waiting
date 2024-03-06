import { useState } from 'react'
import cx from 'classnames'

import styles from '@style/Teammates.module.css'

import { UserResponseDto, UserRole } from '@api-type'
import { ModalPopup, TeammateDetail } from '@component'

type TeammatesProps = {
  teammates?: any
}

export const Teammates = ({ teammates }: TeammatesProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [selectedTeammate, setSelectedTeammate] = useState<UserResponseDto | null>(null)

  const handleSelectTeammate = (teammate: UserResponseDto) => {
    setSelectedTeammate(teammate)
    setIsDetailOpen(true)
  }

  return (
    <>
      <ModalPopup isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)}>
        <TeammateDetail teammate={selectedTeammate} onClose={() => setIsDetailOpen(false)} />
      </ModalPopup>
      {Object.entries(teammates)?.map(([teamName, mates]) => (
        <div key={teamName} className={styles.listContainer}>
          {teamName}
          <div className={styles.list}>
            {(mates as UserResponseDto[])?.map((user) => {
              const isMeetingAvailable = user.role === UserRole.RECIPIENT
              return (
                <div
                  key={user.id}
                  className={cx(styles.listItem, { [styles.meetingAvailable]: isMeetingAvailable })}
                  onClick={() => handleSelectTeammate(user)}
                >
                  <div>{user.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      {!Object.keys(teammates).length && (
        <>
          <div className={styles.listContainer}>소속된 팀이 없습니다.</div>
          <div className={styles.listContainer}>내 설정에서 팀 설정을 해주세요.</div>
        </>
      )}
    </>
  )
}
