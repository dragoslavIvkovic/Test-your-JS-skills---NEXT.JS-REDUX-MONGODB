/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import styles from "../styles/Elements.module.css";

function SaveComponent({ handleClick }) {
  const wrongQuestion = useSelector((state) => state.wrongQuestions);
  const x = Object.values(wrongQuestion);
  const wrongQ = x.flat();
  const counter = useSelector((state) => state.counter);
  const score = Object.values(counter);
  const [isEmpty, setEmpty] = useState(false);

  const updateStateProps = () => {
    handleClick("levels");
  };

  useEffect(() => {
    if (wrongQ.length === 0) {
      return setEmpty(true);
    } else {
      return setEmpty(false);
    }
  }, [wrongQ]);

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
      {!isEmpty && (
        <Link href="/Answers">
          <a className={styles.link}>CHECK WRONG QUESTIONS</a>
        </Link>
      )}
    </div>
  );
}

export default SaveComponent;
