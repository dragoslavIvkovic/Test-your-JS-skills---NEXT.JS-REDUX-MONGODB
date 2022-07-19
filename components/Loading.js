import React from 'react'
import styles from "../styles/Loader.module.css";

function Loading() {
  return (
    <div className={styles.loadingContainer}>
       <div className={styles.loader}></div></div>
     )
  
}

export default Loading