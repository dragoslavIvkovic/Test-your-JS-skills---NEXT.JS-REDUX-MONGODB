/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-filename-extension */

import Link from "next/link";
import styles from "../styles/Header.module.css";

function Header() {
  return (
    <div>
      <nav className={styles.topNav}>
        <div>
          <Link href="/">
            <a className={styles.link}>Home</a>
          </Link>
          <Link href="/Test">
            <a className={styles.link}>Tests</a>
          </Link>
        </div>

        <div className={styles.topNavRight}>
          <Link href="/Answers">
            <a className={styles.link}>Answers</a>
          </Link>
          <Link href="/Report">
            <a className={styles.link}>Report</a>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;
