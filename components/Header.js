
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from '../styles/Elements.module.css';

function Header() {
  const { data: session } = useSession();

  const handleOnError = () => {
    // eslint-disable-next-line no-undef
    setImgSrc('/default-image.png');
  };

  return (
    <div>
      <nav className={styles.topNav}>
        <div>
          <Link href="/"><a className={styles.link}>Home</a></Link>
          <Link href="/QApage"><a className={styles.link}>Tests</a></Link>

        </div>

        <div className={styles.topNavRight}>

          <Link href="/WrongAnswersPage"><a className={styles.link}>WrongAnswersPage</a></Link>

          <Link href="/api/auth/signin">

            {session ? (
              <>
                {/* Signed in as {session.user.email} <br /> */}
                <div className={styles.link}>
                  {' '}
                  <Image
                    src={session?.user?.image}
                    alt="image-alt-text"
                    width={20}
                    height={20}
                    onError={handleOnError}
                  />
                  {' '}

                </div>
                <a
                  onClick={() => signOut(session?.user, {
                    callbackUrl: '/SaveComponent',
                  })}
                  className={styles.link}
                >
                  Sign out

                </a>
              </>
            ) : (
              <a
                onClick={() => signIn(session?.user, {
                  callbackUrl: '/SaveComponent',
                })}
                className={styles.link}
              >
                Sign in

              </a>
            )}

          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;
