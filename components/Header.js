import React from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

function Header() {
  const { data: session } = useSession();

  const handleOnError = () => {
    setImgSrc("/default-image.png");
  };

  return (
    <div>
      <nav className={styles.topnav}>
        <Link href="/">
          <a className={styles.link}>Home</a>
        </Link>
        <Link href="/QApage">
          <a className={styles.link}>QA</a>
        </Link>
        <div className={styles.topNavRight}>
          <Link href="/WrongAnswersPage">
            <a className={styles.link}>WrongAnswersPage</a>
          </Link>
          <Link href="/api/auth/signin">
            < >
              {session ? (
                <>
                  {/* Signed in as {session.user.email} <br /> */}
                 <div className={styles.link}> <Image
                    //  src={'/default-image.png'}

                    src={session?.user?.image}
                    alt="image-alt-text"
                    width={20}
                    height={20}
                    onError={handleOnError}
                  /> </div>
                  <a onClick={() => signOut()} className={styles.link}>Sign out</a>
                </>
              ) : (
                <>
                 
                  <a onClick={() => signIn()} className={styles.link}>Sign in</a>
                </>
              )}
            </>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;
