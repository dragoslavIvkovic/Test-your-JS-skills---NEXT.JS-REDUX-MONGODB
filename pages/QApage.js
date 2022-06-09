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
import uuidv from '../util/uuidv';

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

  const CollectionBtn = collectionALL?.map((x, i) => (
    <button key={uuidv()} className={styles.nextBtn} type="button" onClick={() => setCollection(x.name)}>
      {x.name}
    </button>
  ));

  const QuizLogic = () => {
    if (loading && showScore) {
      <button onClick={() => router.push('/SaveComponent')} type="button">See score</button>;
    } else if (loading && !showScore) {
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
                key={questions._id}
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
      </>;
    } else if (!loading && !showScore) {
      <button onClick={fetchQuestions} className={styles.nextBtn} type="button">
        START
      </button>;
    }
  };

  // eslint-disable-next-line consistent-return
  const QuizEngine = () => {
    if (!collection) {
      return { CollectionBtn };
    }
      <QuizLogic />;
  };

  return (
    <div className={styles.containerQuestions}>

      <div className={styles.block}>
        <QuizEngine />
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
