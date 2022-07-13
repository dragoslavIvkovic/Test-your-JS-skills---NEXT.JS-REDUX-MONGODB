import React from "react";
import Link from "next/link";

import styles from "../styles/Elements.module.css";
 

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
          <Link href="/WrongAnswersPage">
            <a className={styles.link}>WrongAnswersPage</a>
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
