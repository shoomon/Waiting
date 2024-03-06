import { MeetingStatus } from '@entity'

export const RECEIVED_MEETING_EMAIL_SUBJECT = '[E-meeting] 미팅 요청'
export const RECEIVED_MEETING_EMAIL_HTML = (date: string, reporter: string) =>
  `<h3>[E-meeting] 새로운 미팅 요청이 있습니다.</h3><br/>[${date}] ${reporter}님이 미팅을 요청하였습니다.<br/><br/><a href="http://ec2-52-78-122-49.ap-northeast-2.compute.amazonaws.com:3000/meetings/received">확인하기</a>`

export const MEETING_STATUS_EMAIL_SUBJECT = (status: MeetingStatus) =>
  `[E-meeting] 미팅 ${status === MeetingStatus.ACCEPTED ? '수락' : '거절'}`
export const MEETING_STATUS_EMAIL_HTML = (status: MeetingStatus, date: string, recipient: string) =>
  `<h3>[E-meeting] 미팅이 ${
    status === MeetingStatus.ACCEPTED ? '수락' : '거절'
  }되었습니다.</h3><br/>[${date}] ${recipient}님이 미팅을 ${
    status === MeetingStatus.ACCEPTED ? '수락' : '거절'
  }하였습니다.<br/><br/><a href="http://ec2-52-78-122-49.ap-northeast-2.compute.amazonaws.com:3000/meetings/sent">확인하기</a>`
