/* eslint-disable no-unused-vars */
import React from "react";

import { useSelector } from "react-redux";
import styles from "../styles/Elements.module.css";

function SaveComponent({ handleClick }) {
  const counter = useSelector((state) => state.counter);
  const score = Object.values(counter);
  const updateStateProps = () => {
    handleClick("levels");
  };
  return (
    <div className={styles.saveSection}>
      <p className={styles.scoreSection}>
        You scored&nbsp;
        {score}
      </p>
      <button
        type="button"
        onClick={updateStateProps}
        className={styles.nextBtn}
      >
        Play Again
      </button>
    </div>
  );
}

export default SaveComponent;
