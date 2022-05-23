import React, { useEffect, useState } from "react";
import styles from "../styles/Qpage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { CopyBlock, dracula } from "react-code-blocks";

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
    <div className={styles.container}>
      <div className={styles.block}>
        <p>questions: {wrongQ.length}</p>
        <div className={styles.code}>
          {!wrongQ.length ? (
            "you answered everting"
          ) : remainingQuestions == 0 ? (
            <p>No more questions</p>
          ) : (
            <>
              <CopyBlock
                language="javascript"
                text={wrongQ[currentQuestions]?.code}
                theme={dracula}
                showLineNumbers={false}
                highlight="1 -10"
                codeBlock
              />

              <p>{wrongQ[currentQuestions]?.answer}</p>
              <p>{wrongQ[currentQuestions]?.answerText}</p>
            </>
          )}
        </div>
        <button onClick={nextQ}>next</button>
      </div>
    </div>
  );
}

export default WrongAnswersPage;
