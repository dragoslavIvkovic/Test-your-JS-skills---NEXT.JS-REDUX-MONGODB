import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'; import { useRouter } from 'next/router';
import styles from '../styles/Elements.module.css';

// eslint-disable-next-line max-len
function QuizLogic(questions, collection, collectionALL, setCollection, loading, showScore, currentQuestion, handleAnswerOptionClick, countDownBarWith, fetchQuestions, totalTime) {
  const { questions: que } = questions;
  // const { loading: load } = loading;

  const router = useRouter();
  if (!collection) {
    return (collectionALL?.map((x) => (
      <button className={styles.nextBtn} type="button" onClick={() => setCollection(x.name)}>
        {x.name}
      </button>
    )));
  } if (collection && loading && showScore) {
    return (
      <button onClick={() => router.push('/SaveComponent')} type="button">
        See score
      </button>
    );
  } if (collection && loading && !showScore) {
    <>
      <div className={styles.questionCount}>
        <p className={styles.questionText}>
          What is the output?
        </p>

        <p className={styles.questionText}>
          Question
          {currentQuestion + 1}
          /
          {que.length}
        </p>
      </div>

      <div className={styles.code}>
        <SyntaxHighlighter
          wrapLines
          language="javascript"
          style={dracula}
        >
          {que[currentQuestion].code.replace(
            /(^"|"$)/g,
            // eslint-disable-next-line quotes
            "",
          )}
        </SyntaxHighlighter>
      </div>
      <div className={styles.answer_section}>
        {que[currentQuestion].answerOptions.map(
          (answerOption) => (
            <button
              type="button"
              className={styles.answer}
                                // eslint-disable-next-line no-underscore-dangle
              key={que._id}
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
      <div style={countDownBarWith} className={styles.bar} type="button">
        <span>
          {totalTime.toFixed(0)}
          sec
        </span>
      </div>
    </>;
  } else if (collection && !loading) {
    <button onClick={fetchQuestions} className={styles.nextBtn} type="button">
      START
    </button>;
  }
}

export default QuizLogic;
