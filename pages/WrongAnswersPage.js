/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "../styles/Elements.module.css";

function WrongAnswersPage() {
  const [currentQuestions, setCurrentQuestion] = useState(0);
  const wrongQuestion = useSelector((state) => state.wrongQuestions);
  const x = Object.values(wrongQuestion);
  const wrongQ = x.flat();
 

  const [remainingQuestions, setRemainingQuestions] = useState(wrongQ.length);

  const nextQ = () => {
    const nextQuestion = currentQuestions + 1;
    if (nextQuestion < wrongQ.length) {
      setCurrentQuestion(nextQuestion);
      setRemainingQuestions(remainingQuestions - 1);
    } else {
      setRemainingQuestions(0);
    }
  };

  return (
    <div className={styles.containerQuestions}>
      <div className={styles.block}>
        <div className={styles.nextBtnContainer}>
          <p>questions: {wrongQ.length}</p>
          <button onClick={nextQ} className={styles.nextBtn} type="button">
            next
          </button>
        </div>
        <div className={styles.code}>
          {!wrongQ.length ? (
            "you answered everting"
          ) : remainingQuestions == 0 ? (
            <p>No more questions</p>
          ) : (
            <>
            <SyntaxHighlighter wrapLines={true} language="javascript" style={dracula}>
                {wrongQ[currentQuestions]?.code}
              </SyntaxHighlighter>
              
                <div className={styles.correctAnswer}>
                  <p className={styles.correctTitle}>ANSWER:</p>
                  <p className={styles.correctText}>
                    {" "}
                    {wrongQ[currentQuestions]?.answer}
                  </p>
                </div>
                <div className={styles.correctAnswer}>
                  <p className={styles.correctTitle}>EXPLANATION:</p>
                  <p className={styles.correctTextExplanation}>
                    {" "}
                    {wrongQ[currentQuestions]?.answerText}
                  </p>
                </div>
               
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WrongAnswersPage;
