import { User, UserGroup, UserGroupLabel, UserTeam, UserTeamLabel } from '@entity'

export const getTeamLabels = (teams: UserTeam[]) => {
  if (!teams) return []
  return teams.map((team) => {
    return {
      value: team,
      label: UserTeamLabel[team],
    }
  })
}

export const getTeamLabel = (team: UserTeam) => {
  return {
    value: team,
    label: UserTeamLabel[team],
  }
}

export const getGroupLabel = (group: UserGroup) => {
  return {
    value: group,
    label: UserGroupLabel[group],
  }
}

export const addLabelsToUser = (user: User) => {
  return {
    ...user,
    group: getGroupLabel(user.group),
    teams: getTeamLabels(user.teams),
  }
}

export const getTeamFromLabel = (label: string): UserTeam => {
  return Object.entries(UserTeamLabel).find(([_, value]) => value === label)?.[0] as UserTeam | undefined
}

export const getGroupFromLabel = (label: string): UserGroup => {
  return Object.entries(UserGroupLabel).find(([_, value]) => value === label)?.[0] as UserGroup | undefined
}
