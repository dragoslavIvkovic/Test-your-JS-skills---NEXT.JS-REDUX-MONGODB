/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "../styles/Elements.module.css";

function Answers() {
  const [currentQuestions, setCurrentQuestion] = useState(0);
  const wrongQuestion = useSelector((state) => state.wrongQuestions);
  const x = Object.values(wrongQuestion);
  const wrongQ = x.flat();

  const [remainingQuestions, setRemainingQuestions] = useState(wrongQ.length);
  const nextQuestion = currentQuestions + 1;
  const nextQ = () => {
    if (nextQuestion < wrongQ.length) {
      setCurrentQuestion(nextQuestion);
      setRemainingQuestions(remainingQuestions - 1);
    } else {
      setRemainingQuestions(0);
    }
  };

  function SelectContent() {
    if (!wrongQ.length) {
      return <p className={styles.nextBtn}>you answered everting</p>;
    }
    if (remainingQuestions === 0) {
      return <p className={styles.nextBtn}>No more questions</p>;
    }
    return (
      <div className={styles.block}>
        <div className={styles.nextBtnContainer}>
          <p>
            questions: {wrongQ.length} / {currentQuestions}
          </p>
          <button onClick={nextQ} className={styles.nextBtn} type="button">
            next
          </button>
        </div>

        <SyntaxHighlighter
          lineProps={{
            style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
          }}
          wrapLines
          language="javascript"
          style={dracula}
          className={styles.highlighter}
        >
          {wrongQ[currentQuestions]?.code}
        </SyntaxHighlighter>

        <div className={styles.correctAnswer}>
          <p className={styles.correctTitle}>ANSWER:</p>
          <p className={styles.correctText}>
            {" "}
            {wrongQ[currentQuestions]?.answer}
          </p>

          <p className={styles.correctTitle}>EXPLANATION:</p>
          <p className={styles.correctTextExplanation}>
            {" "}
            {wrongQ[currentQuestions]?.answerText}
          </p>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className={styles.containerQuestions}>
      <SelectContent />
    </div>
  );
}

export default Answers;
