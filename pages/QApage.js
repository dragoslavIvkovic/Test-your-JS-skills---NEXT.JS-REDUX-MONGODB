/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { increment, reset } from '../store/reducers/counterSlice';
import {
  addWrongQuestions,
  resetWrongQuestions,
} from '../store/reducers/wrongQueCounterSlice';
import clientPromise from '../lib/mongodb';
import styles from '../styles/Elements.module.css';
import shuffleArray from '../util/shuffle';
import uudiv from '../util/uuidv';

export default function Questions({ data, collectionALL }) {
  const { data: session, status } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const [questions, setQuestions] = useState({});
  const [collection, setCollection] = useState();
  const loading = useRef(false);
  const isActive = useRef(false);
  const [totalTime, setTotalTime] = useState(10);
  const width = useRef(100);
  const router = useRouter();
  const dispatch = useDispatch();

  function startFn() {
    isActive.current = !isActive.current;
  }

  function setWrongQuestions() {
    dispatch(addWrongQuestions(questions[currentQuestion]));
  }

  const fetchQuestions = () => {
    setQuestions(shuffleArray(data));
    loading.current = !loading.current;
    startFn();
    dispatch(reset());
    dispatch(resetWrongQuestions(0));
  };

  const nextQuestion = currentQuestion + 1;

  const handleAnswerOptionClick = (isCorrect) => {
    if (
      (totalTime === 0 && nextQuestion === questions.length)
      || (!isCorrect && nextQuestion === questions.length)
      || (isCorrect && nextQuestion === questions.length)
    ) {
      isActive.current = false;
      setShowScore(true);
    } else if (isCorrect && nextQuestion < questions.length) {
      dispatch(increment());
      setCurrentQuestion(nextQuestion);
      isActive.current = true;
      setTotalTime(10);
    } else if (!isCorrect && nextQuestion < questions.length) {
      setWrongQuestions();
      setCurrentQuestion(nextQuestion);
      isActive.current = true;
      setTotalTime(10);
    }
  };

  // const shuffle = () => 0.10 - Math.random()

  const countDownBarWith = {
    width: totalTime * 10,
  };

  useEffect(() => {
    let interval = null;

    if (isActive.current) {
      interval = setInterval(() => {
        // eslint-disable-next-line no-unused-expressions
        totalTime === 0
          ? handleAnswerOptionClick()
          : setTotalTime(totalTime - 1);
        width.current = width - 10;
      }, 1000);
    } else if (nextQuestion === questions.length) {
      setWrongQuestions();
      startFn();
      setShowScore(true);
    }

    return () => clearInterval(interval);
  }, [isActive.current, totalTime]);

  useEffect(() => {
    if (collection !== router.query.collection) {
      router.push(`/QApage?collection=${collection}`);
    }
  }, [collection]);

  return (
    <div className={styles.containerQuestions}>

      <div className={styles.block}>
        {collection === undefined ? (

          collectionALL?.map((x) => (
            <button className={styles.nextBtn} type="button" onClick={() => setCollection(x.name)}>
              {x.name}
            </button>
          ))

        ) : (

          loading.current ? (
            <div className="score">
              {showScore ? (
                <button onClick={() => router.push('/SaveComponent')} type="button">
                  See score
                </button>
              ) : (
                <>
                  <div className={styles.questionCount}>
                    <p className={styles.questionText}>
                      What is the output?
                    </p>

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
              )}
            </div>
          ) : (
          // eslint-disable-next-line react/button-has-type
            <button onClick={fetchQuestions} className={styles.nextBtn}>
              START
            </button>
          )

        )}
        <div />
      </div>

    </div>
  );
}

export async function getServerSideProps({ query: { collection = 'xxx' } }) {
  const client = await clientPromise;

  const db = client.db('javascript_questions');
  let data = await db.collection(collection).find({}).toArray();
  data = JSON.parse(JSON.stringify(data));

  let collectionALL = await db.listCollections().toArray();
  collectionALL = JSON.parse(JSON.stringify(collectionALL));

  return {
    props: { data, collectionALL },
  };
}
