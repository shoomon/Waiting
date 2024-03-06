import { format, formatDistanceToNow, parseISO, differenceInCalendarDays } from 'date-fns'
import { ko } from 'date-fns/locale'

export const getFormattedDate = (dateString: string): string => {
  const date = parseISO(dateString)
  const today = new Date()

  const dayDifference = differenceInCalendarDays(today, date)
  const time = format(date, 'a hh:mm', { locale: ko })

  if (dayDifference < 1) {
    return `오늘 (${time})`
  } else if (dayDifference < 7) {
    return `${dayDifference}일전 (${time})`
  } else if (dayDifference < 30) {
    return `${Math.floor(dayDifference / 7)}주전 (${time})`
  }

  const distance = formatDistanceToNow(date, { locale: ko })

  if (distance.includes('month')) {
    const months = parseInt(distance)
    return `${months}개월 전 (${time})`
  }

  if (distance.includes('year')) {
    const years = parseInt(distance)
    return `${years}년 전 (${time})`
  }

  return 'Date Error'
}
