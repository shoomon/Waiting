import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import styles from '@style/Menu.module.css'

import MenuIcon from '@icon/menu.svg'
import CloseIcon from '@icon/close.svg'

import { ROUTES } from '@util'

export const Menu = () => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleMenuClick = (route: string) => {
    if (router.pathname === route) toggleMenu()
    else router.push(route)
  }

  return (
    <div className={styles.menuContainer}>
      <div
        className={styles.overlay}
        onClick={() => menuOpen && toggleMenu()}
        style={{ display: menuOpen ? 'block' : 'none' }}
      />
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className={styles.menuContent}
            transition={{ ease: 'easeOut', duration: 0.4 }} // Adjust duration and ease
          >
            <button className={styles.closeButton} onClick={toggleMenu}>
              <CloseIcon width={24} height={24} fill={'#282828'} />
            </button>
            <p className={styles.menuItem} onClick={() => handleMenuClick(ROUTES.Main)}>
              메인
            </p>
            <p className={styles.menuItem} onClick={() => handleMenuClick(ROUTES.SentMeeting)}>
              보낸 미팅
            </p>
            <p className={styles.menuItem} onClick={() => handleMenuClick(ROUTES.ReceivedMeeting)}>
              받은 미팅
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <button className={styles.menuButton} onClick={toggleMenu}>
        <MenuIcon width={24} height={24} fill={'#282828'} />
      </button>
    </div>
  )
}
