import React, { useState } from 'react'

import styles from '@style/Header.module.css'

import SettingsIcon from '@icon/settings.svg'

import { Menu, ModalPopup, MySettings } from '@component'

type HeaderProps = {
  title?: string
}

export const Header = ({ title }: HeaderProps) => {
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)

  return (
    <header className={styles.header}>
      <Menu />
      <div className={styles.logo}>{title}</div>
      <div className={styles.settings} onClick={() => setIsSettingOpen(true)}>
        <SettingsIcon />
      </div>
      <ModalPopup isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)}>
        <MySettings onClose={() => setIsSettingOpen(false)} />
      </ModalPopup>
    </header>
  )
}
