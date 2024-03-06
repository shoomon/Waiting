export enum UserType {
  ADMIN = 'ADMIN',
  GENERAL = 'GENERAL',
}

export enum UserGroup {
  NOT_BELONG = 'NOT_BELONG',
  NAVER = 'NAVER',
  HYUNDAI_DPTSTR = 'HYUNDAI_DPTSTR',
  HYUNDAI_DFS = 'HYUNDAI_DFS',
}

export const UserGroupLabel = {
  [UserGroup.NOT_BELONG]: '소속 없음',
  [UserGroup.NAVER]: '네이버',
  [UserGroup.HYUNDAI_DPTSTR]: '현대백화점',
  [UserGroup.HYUNDAI_DFS]: '현대백화점 면세점',
}

export enum UserTeam {
  NAVER_DEV = 'NAVER_DEV',
  HYUNDAI_DPTSTR_MARKETING = 'HYUNDAI_DPTSTR_MARKETING',
  HYUNDAI_DPTSTR_BUSINESS = 'HYUNDAI_DPTSTR_BUSINESS',
  HYUNDAI_DPTSTR_HUMAN_RESOURCE = 'HYUNDAI_DPTSTR_HUMAN_RESOURCE',
  HYUNDAI_DFS_MARKETING = 'HYUNDAI_DFS_MARKETING',
  HYUNDAI_DFS_BUSINESS = 'HYUNDAI_DFS_BUSINESS',
  HYUNDAI_DFS_HUMAN_RESOURCE = 'HYUNDAI_DFS_HUMAN_RESOURCE',
}

export const UserTeamLabel = {
  [UserTeam.NAVER_DEV]: '개발팀',
  [UserTeam.HYUNDAI_DPTSTR_BUSINESS]: '경영지원팀',
  [UserTeam.HYUNDAI_DPTSTR_MARKETING]: '마케팅팀',
  [UserTeam.HYUNDAI_DPTSTR_HUMAN_RESOURCE]: '인사팀',
  [UserTeam.HYUNDAI_DFS_BUSINESS]: '경영지원팀',
  [UserTeam.HYUNDAI_DFS_MARKETING]: '마케팅팀',
  [UserTeam.HYUNDAI_DFS_HUMAN_RESOURCE]: '인사팀',
}

export enum UserRole {
  REPORTER = 'REPORTER',
  RECIPIENT = 'RECIPIENT',
}

export const GroupTeamMap = {
  [UserGroup.NOT_BELONG]: [],
  [UserGroup.NAVER]: [UserTeam.NAVER_DEV],
  [UserGroup.HYUNDAI_DPTSTR]: Object.values(UserTeam).filter((team) => team.startsWith('HYUNDAI_DPTSTR')),
  [UserGroup.HYUNDAI_DFS]: Object.values(UserTeam).filter((team) => team.startsWith('HYUNDAI_DFS')),
}

export const EMAIL_GROUP_MAP = {
  'navercorp.com': UserGroup.NAVER,
  'hddfs.com': UserGroup.HYUNDAI_DFS,
}

export enum MeetingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
}
