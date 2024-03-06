import React, { useState } from 'react'

import styles from '@style/Home.module.css'

import SettingsIcon from '@icon/settings.svg'

import { Menu, ModalPopup, MySettings } from '@component'

const Temp: React.FC = () => {
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)

  return (
    <>
      <header className={styles.header}>
        <Menu />
        <div className={styles.logo}>Waiting</div>
        <div className={styles.settings} onClick={() => setIsSettingOpen(true)}>
          <SettingsIcon />
        </div>
        <ModalPopup isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)}>
          <MySettings onClose={() => setIsSettingOpen(false)} />
        </ModalPopup>
      </header>
      <div>임시 페이지</div>
    </>
  )
}

export default Temp
