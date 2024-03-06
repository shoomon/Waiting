import styles from '@style/MeetingEdit.module.css'

type MeetingEditProps = {
  editedContent: string
  setEditedContent: (content: string) => void
  handleEditMeeting: () => void
}

export const MeetingEdit = ({ editedContent, setEditedContent, handleEditMeeting }: MeetingEditProps) => {
  return (
    <>
      <div className={styles['form-group']}>
        <label>미팅 내용</label>
        <input type="text" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
      </div>
      <button onClick={handleEditMeeting} className={styles.button}>
        미팅 내용 수정
      </button>
    </>
  )
}
