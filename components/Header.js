import React from "react";
import Link from "next/link";

import styles from "../styles/Elements.module.css";
import BtnSignIn from "./BtnSignIn";

function Header() {
  return (
    <div>
      <nav className={styles.topNav}>
        <div>
          <Link href="/">
            <a className={styles.link}>Home</a>
          </Link>
          <Link href="/QApage">
            <a className={styles.link}>Tests</a>
          </Link>
        </div>

        <div className={styles.topNavRight}>
          <Link href="/WrongAnswersPage">
            <a className={styles.link}>WrongAnswersPage</a>
          </Link>

          <BtnSignIn />
        </div>
      </nav>
    </div>
  );
}

export default Header;
