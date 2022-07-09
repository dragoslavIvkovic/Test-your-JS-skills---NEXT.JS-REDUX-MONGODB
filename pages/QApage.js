/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useRouter } from 'next/router';
import { increment, reset } from '../store/reducers/counterSlice';
import {
  addWrongQuestions,
  resetWrongQuestions,
} from '../store/reducers/wrongQueCounterSlice';
import { setLevel } from '../store/reducers/collectionSlice';
import clientPromise from '../lib/mongodb';
import styles from '../styles/Elements.module.css';
import shuffleArray from '../util/shuffle';
import uudiv from '../util/uuidv';
import SaveComponent from './SaveComponent'

export default function Questions({ data }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
 

  const [questions, setQuestions] = useState({});
  const [collection, setCollection] = useState();
  const loading = useRef(false);
  const isActive = useRef(false);
  const [totalTime, setTotalTime] = useState(10);
  const width = useRef(100);
  const router = useRouter();
  const dispatch = useDispatch();

  function setWrongQuestions() {
    dispatch(addWrongQuestions(questions[currentQuestion]));
  }

  const fetchQuestions = () => {
    setQuestions(shuffleArray(data));
    loading.current = true;

    isActive.current = true;
    dispatch(reset());
    dispatch(resetWrongQuestions(0));
    dispatch(setLevel(collection));
    setGame('test');
  };

  const nextQuestion = currentQuestion + 1;

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect && nextQuestion < questions.length) {
      setTotalTime(10);
      setCurrentQuestion(nextQuestion);
      dispatch(increment());
      isActive.current = true;
    } else if (!isCorrect && nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setWrongQuestions();
      isActive.current = true;
      setTotalTime(10);
    } else if (
      (totalTime === 0 && nextQuestion === questions.length)
      || (!isCorrect && nextQuestion === questions.length)
      || (isCorrect && nextQuestion === questions.length)
    ) {
      isActive.current = false;
    
      setGame('score')
    }
  };

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
      // startFn();
      
      () => handleClick('score')
    }

    return () => clearInterval(interval);
  }, [isActive.current, totalTime]);

  useEffect(() => {
    if (collection !== router.query.collection) {
      router.push(`/QApage?collection=${collection}`);
    }
  }, [collection]);


  const [game, setGame] = useState('levels')

  const handleClick = (gameState) => {
    setGame(gameState)
  }

  // eslint-disable-next-line react/display-name
  function SelectContent () {
    switch (game) {
   
    case "levels":
      return <LevelOptions handleClick={handleClick} />;
    case "start":
      return <FetchQuestions handleClick={handleClick} />;
    case "test":
      return <TestLogic handleClick={handleClick}/>;
    case "score":
      return <SaveComponent handleClick={handleClick} />;
    default:
      return null;
    }
  }

  const Levels = ['beginnerSample','middleSample','hardcoreSample']
  const LevelOptions = () => {
    return  Levels.map(x => 
      <button key={x}   className={styles.nextBtn} type="button"   onClick={() => { setCollection(x);setGame('start')}}>{x}</button>
    ) 
    
  }

  const FetchQuestions = () => {
    return (<button onClick={fetchQuestions} className={styles.nextBtn} type="button">
            START
    </button>)
  }


  const TestLogic = () => {
    return ( <>
      <div className={styles.questionCount}>
        <p className={styles.questionText}>What is the output?</p>
        <p className={styles.questionText}>
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
    </>)
  }


  return (
    <div className={styles.containerQuestions}>
      <div className={styles.block}>
        
        <SelectContent />
      </div>
    </div>
  );
}

export async function getServerSideProps({ query: { collection = 'beginner' } }) {
  const client = await clientPromise;

  const db = client.db('javascript_questions');
  let data = await db.collection(collection).find({}).toArray();
  data = JSON.parse(JSON.stringify(data));

  return {
    props: { data },
  };
}
