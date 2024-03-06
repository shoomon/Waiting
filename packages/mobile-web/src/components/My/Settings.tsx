import React, { useState } from 'react'

import styles from '@style/MySettings.module.css'

import { LabeledDto, UserRole } from '@api-type'
import { useLoginContext } from '@context'

import { useAxios } from '../../hooks/useAxios'

type MySettingsProps = {
  onClose: () => void
}

export const MySettings = ({ onClose }: MySettingsProps) => {
  const { me, refetch, logout } = useLoginContext()

  const { email, group, name, role, teams: _teams } = me || {}
  const { api } = useAxios()

  const [editedName, setEditedName] = useState<string>(name as string)
  const [editedRole, setEditedRole] = useState<UserRole>(role as UserRole)
  const [teams, setTeams] = useState<LabeledDto[]>(_teams || [])
  const [joinableTeams, setJoinableTeams] = useState<LabeledDto[]>([])
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState<boolean>(false)

  const isRecipients = editedRole === UserRole.RECIPIENT
  const handleUserRoleChanges = () => setEditedRole(isRecipients ? UserRole.REPORTER : UserRole.RECIPIENT)

  const fetchTeams = async () => {
    try {
      const response = (await api.teams.getTeams()) as any
      const teamsLabel = teams.map((team) => team.label)
      setJoinableTeams([...response.data].filter((team) => !teamsLabel.includes(team.label)))
    } catch (e) {
      console.error(e)
    }
  }

  const handleFindTeams = () => {
    setIsTeamDropdownOpen(!isTeamDropdownOpen)
    fetchTeams()
  }

  const handleSelectTeam = (team: LabeledDto) => {
    setTeams([...teams, team])
    setIsTeamDropdownOpen(false)
  }

  const handleLeaveTeam = (team: LabeledDto) => {
    setTeams(teams.filter((t) => t.value !== team.value))
  }

  const updateUser = async () => {
    try {
      await api.users.updateUser({ name: editedName, role: editedRole, teams: teams.map(({ value }) => value) })
      onClose()
      refetch?.()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles['form-group']}>
        <label>Email</label>
        <input type="text" value={email} disabled={true} />
      </div>
      <div className={styles['form-group']}>
        <label>소속</label>
        <input type="text" value={group?.label} disabled={true} />
      </div>
      <div className={styles['form-group']}>
        <label>이름</label>
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles['toggle-group']}>
        <label>보고받기 :</label>
        <label className={styles.toggle}>
          <input type="checkbox" checked={isRecipients} onChange={handleUserRoleChanges} />
          {isRecipients ? 'ON' : 'OFF'}
        </label>
      </div>
      <div className={styles['form-group']}>
        <label>팀</label>
        <button className={styles.button} onClick={handleFindTeams}>
          {isTeamDropdownOpen && joinableTeams.length ? '닫기' : '찾아보기'}
        </button>
        {isTeamDropdownOpen && (
          <div className={styles.teamDropdown}>
            {joinableTeams.length === 0 && <div className={styles.teamDropdownItem}>결과 없음</div>}
            {joinableTeams?.map((team) => (
              <div key={team.value} className={styles.teamDropdownItem} onClick={() => handleSelectTeam(team)}>
                {team.label}
              </div>
            ))}
          </div>
        )}
        <div className={styles.teamsContainer}>
          {teams?.map((team) => (
            <div key={team.value} className={styles.teamItem}>
              {team.label}
              <button className={styles.removeButton} onClick={() => handleLeaveTeam(team)}>
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <button onClick={updateUser} className={styles.button}>
        수정
      </button>
      <button onClick={logout} className={styles['logout-button']}>
        로그아웃
      </button>
    </div>
  )
}
