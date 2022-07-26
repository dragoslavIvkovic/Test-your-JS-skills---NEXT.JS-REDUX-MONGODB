import Link from "next/link";
import React from "react";
 
import styles from "../styles/Hero.module.css"
 
 

function Hero() {
  // const myLoader = ({ src, width, quality }) => {
  //   return `https://example.com/${src}?w=${width}&q=${quality || 75}`
  // }

  return (
    <div className={styles.heroContainer}>
      <p className={styles.paragraph}>
       
      </p>
  <Link href="/Test">
            <a className={styles.nextBtn}>Tests</a>
          </Link>
       
    </div>
  );
}

export default Hero;
