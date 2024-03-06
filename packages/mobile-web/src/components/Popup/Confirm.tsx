import styles from '@style/Confirm.module.css'

import { ModalPopup } from './ModalPopup'

type ConfirmChildrenProps = {
  confirmLabel: string
  onClickConfirm: () => void
}

const ConfirmChildren = ({ confirmLabel, onClickConfirm }: ConfirmChildrenProps) => {
  return (
    <button onClick={onClickConfirm} className={styles.button}>
      {confirmLabel}
    </button>
  )
}

type ConfirmProps = {
  confirmLabel: string
  onClickConfirm: () => void
  isPopupChildren?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export const Confirm = ({ confirmLabel, onClickConfirm, isPopupChildren = false, isOpen, onClose }: ConfirmProps) => {
  return isPopupChildren ? (
    <ModalPopup
      isOpen={!!isOpen}
      onClose={() => {
        onClose?.()
      }}
    >
      <ConfirmChildren confirmLabel={confirmLabel} onClickConfirm={onClickConfirm} />
    </ModalPopup>
  ) : (
    <ConfirmChildren confirmLabel={confirmLabel} onClickConfirm={onClickConfirm} />
  )
}
