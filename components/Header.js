import React from 'react'
import Link from 'next/link'
import styles from '../styles/Header.module.css'

function Header () {
  return (
    <div>
      <nav className={styles.topnav}>
        <Link href='/'>
          <a className={styles.link}>Home</a>
        </Link>
        <div className={styles.topnavRight}>
          <Link href='/profile'>
            <a className={styles.link}>Login</a>
          </Link>
          <Link href='/protected' className={styles.link}>
            <a className={styles.link}>Protected route</a>
          </Link>
          <Link href='/protected-client-route'>
            <a className={styles.link}>Protected client route</a>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Header
