/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useRouter } from "next/router";
import { increment, reset } from "../store/reducers/counterSlice";
import {
  addWrongQuestions,
  resetWrongQuestions,
} from "../store/reducers/wrongQueCounterSlice";

import clientPromise from "../lib/mongodb";
import styles from "../styles/Elements.module.css";

import SaveComponent from "./SaveComponent";

export default function Questions({ data }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState({});
  const [collection, setCollection] = useState();
  const loading = useRef(false);
  const isTimeActive = useRef(false);
  const [totalTime, setTotalTime] = useState(10);
  const [endTimer, setEndTimer] = useState(false);
  const width = useRef(100);
  const router = useRouter();
  const dispatch = useDispatch();
  const [game, setGame] = useState("levels");

  const handleClick = (gameState) => {
    setGame(gameState);
  };

  function setWrongQuestions() {
    dispatch(addWrongQuestions(questions[currentQuestion]));
  }

  const fetchQuestions = () => {
    setQuestions(data);
    loading.current = true;
    isTimeActive.current = true;
    dispatch(reset());
    dispatch(resetWrongQuestions(0));
    setGame("test");
  };

  const nextQuestion = currentQuestion + 1;

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect && nextQuestion < questions.length) {
      setTotalTime(10);
      setCurrentQuestion(nextQuestion);
      dispatch(increment());
      isTimeActive.current = true;
    } else if (!isCorrect && nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setWrongQuestions();
      isTimeActive.current = true;
      setTotalTime(10);
    } else if (!isCorrect && nextQuestion === questions.length) {
      setWrongQuestions();
      isTimeActive.current = false;
      setGame("score");
      setCurrentQuestion(0);
    } else if (isCorrect && nextQuestion === questions.length) {
      dispatch(increment());
      isTimeActive.current = false;
      setGame("score");
      setCurrentQuestion(0);
    }
  };

  const countDownBarWith = {
    width: totalTime * 10 + "%",
  };

  const EndOfCountDown = () => {
    if (totalTime === 0) {
      setEndTimer(true);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isTimeActive.current) {
      interval = setInterval(() => {
        totalTime === 0
          ? handleAnswerOptionClick()
          : setTotalTime(totalTime - 1);
        width.current = width - 10;
      }, 1000);
    } else if (nextQuestion === questions.length) {
      setWrongQuestions();
      () => handleClick("score");
      setCurrentQuestion(0);
    }

    return () => clearInterval(interval);
  }, [nextQuestion, questions.length, setWrongQuestions, totalTime]);

  useEffect(() => {
    if (collection !== router.query.collection) {
      router.push(`/Test?collection=${collection}`);
    }
  }, [collection]);

  function SelectContent() {
    switch (game) {
      case "levels":
        return <LevelOptions handleClick={handleClick} />;
      case "start":
        return <FetchQuestions handleClick={handleClick} />;
      case "test":
        return <TestLogic handleClick={handleClick} />;
      case "score":
        return <SaveComponent handleClick={handleClick} />;
      default:
        return null;
    }
  }

  const Levels = ["novice", "advanced", "expert"];
  const LevelOptions = () =>
    Levels.map((x) => (
      <button
        key={x}
        className={styles.nextBtn}
        type="button"
        onClick={() => {
          setCollection(x);
          setGame("start");
        }}
      >
        {x}
      </button>
    ));

  function FetchQuestions() {
    return (
      <button onClick={fetchQuestions} className={styles.nextBtn} type="button">
        START
      </button>
    );
  }

  function TestLogic() {
    return (
      <div className={styles.block}>
        <div className={styles.questionCount}>
          <p className={styles.questionText}>What is the output?</p>
          <p className={styles.questionText}>
            {currentQuestion + 1}/{questions.length}
          </p>
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
          {questions[currentQuestion].code.replace(
            /(^"|"$)/g,

            ""
          )}
        </SyntaxHighlighter>

        <div className={styles.answer_section}>
          {console.log("render")}
          {questions[currentQuestion].answerOptions.map((answer) => (
            <button
              type="button"
              className={styles.answer}
              key={answer.answerText}
              onClick={() =>
                handleAnswerOptionClick(
                  answer.isCorrect,
                  questions,
                  currentQuestion
                )
              }
            >
              {answer.answerText}
            </button>
          ))}
        </div>
        <ProgressBar />
      </div>
    );
  }

  function ProgressBar() {
    return (
      <div style={countDownBarWith} className={styles.bar}>
        <span>
          {totalTime.toFixed(0)}
          sec
        </span>
      </div>
    );
  }

  return (
    <div className={styles.containerQuestions}>
      <SelectContent />
    </div>
  );
}

export async function getServerSideProps({
  query: { collection = "beginner" },
}) {
  const client = await clientPromise;

  const db = client.db("javascript_questions");
  let data = await db.collection(collection).find({}).toArray();
  data = JSON.parse(JSON.stringify(data));

  return {
    props: { data },
  };
}
