import React from "react";
import Link from "next/link";
import styles from "../styles/Elements.module.css";
import { useSession, signIn, signOut } from "next-auth/react";

import Image from "next/image";

function BtnSignIn() {
  const { data: session } = useSession();
  const handleSignIn = (e) => {
    e.preventDefault();
    signIn(session?.user, {
      callbackUrl: "/SaveComponent",
    });
  };
  const handleSignOut = (e) => {
    e.preventDefault();
    signOut(session?.user, {
      callbackUrl: "/SaveComponent",
    });
  };

  const handleOnError = () => {
     
    setImgSrc("/default-image.png");
  };

  return (
    <Link href="/api/auth/signin" className={styles.link}>
      {session ? (
        <div className={styles.link}>
          <div className={styles.linkImg}>
            <Image
              src={session?.user?.image}
              alt="image-alt-text"
              width={20}
              height={20}
              onError={handleOnError} 
            /></div>
          <a onClick={handleSignOut}>Sign out</a>
        </div>
      ) : (
        <>
          <a onClick={handleSignIn} type="button" className={styles.link}>
            Sign in
          </a>
        
        </>
      )}
    </Link>
  );
}

export default BtnSignIn;
