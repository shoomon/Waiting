import { format } from 'date-fns'

export const getDateForEmailNotification = (date: Date) => {
  return format(date, 'yyyy-MM-dd a h:mm')
}

export const getKoreanTime = () => {
  const currentUTC = new Date()
  return new Date(currentUTC.getTime() + 9 * 60 * 60 * 1000)
}
