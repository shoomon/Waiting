import { MeetingStatus } from '@api-type'

export const MeetingStatusLabel = {
  [MeetingStatus.PENDING]: '대기중',
  [MeetingStatus.ACCEPTED]: '승인',
  [MeetingStatus.REFUSED]: '거절',
}
