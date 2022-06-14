/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CopyBlock, dracula } from 'react-code-blocks';
import styles from '../styles/Elements.module.css';

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
          <p>
            questions:
            {' '}
            {wrongQ.length}
          </p>
          <button onClick={nextQ} className={styles.nextBtn} type="button">next</button>

        </div>
        <div className={styles.code}>
          {!wrongQ.length ? (
            'you answered everting'
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
              <div className="answer-container">
                <div className={styles.correctAnswer}>
                  <p className={styles.correctTitle}>ANSWER:</p>
                  <p className={styles.correctText}>
                    {' '}
                    {wrongQ[currentQuestions]?.answer}
                  </p>
                </div>
                <div className={styles.correctAnswer}>
                  <p className={styles.correctTitle}>EXPLANATION:</p>
                  <p className={styles.correctTextExplanation}>
                    {' '}
                    {wrongQ[currentQuestions]?.answerText}
                  </p>

                </div>
              </div>

            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default WrongAnswersPage;
