import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useRouter } from 'next/router';
import styles from '../styles/Elements.module.css';

// eslint-disable-next-line max-len
function QuizLogic(showScore, totalTime, fetchQuestions, loading, currentQuestion, questions, handleAnswerOptionClick, countDownBarWith) {
  const router = useRouter();


  if (loading.current && showScore) {
    return (
      <button
        onClick={() => router.push('/SaveComponent')}
        type="button"
      >
        See score
      </button>
    );
  } if (loading.current && !showScore) {
    return (
      <>
        <div className={styles.questionCount}>
          <p className={styles.questionText}>What is the output?</p>

          <p className={styles.questionText}>
            Question
            {currentQuestion + 1}
            /
            {questions.length}
          </p>
        </div>

        <div className={styles.code}>
          <SyntaxHighlighter
            wrapLines
            language="javascript"
            style={dracula}
          >
            {questions[currentQuestion].code.replace(
              /(^"|"$)/g,
              // eslint-disable-next-line quotes
              "",
            )}
          </SyntaxHighlighter>
        </div>
        <div className={styles.answer_section}>
          {questions[currentQuestion].answerOptions.map(
            (answerOption) => (
              <button
                type="button"
                className={styles.answer}
                        // eslint-disable-next-line no-underscore-dangle
                        // eslint-disable-next-line no-undef
                key={uudiv()}
                onClick={() => handleAnswerOptionClick(
                  answerOption.isCorrect,
                  questions,
                  currentQuestion,
                )}
              >
                {answerOption.answerText}
              </button>
            ),
          )}
        </div>
        <div style={countDownBarWith} className={styles.bar}>
          <span>
            {totalTime.toFixed(0)}
            sec
          </span>
        </div>
      </>
    );
  } if (!loading.current) {
    return (
      <button onClick={fetchQuestions} className={styles.nextBtn} type="button">
        START
      </button>
    );
  }
}

export default QuizLogic;
