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

import uudiv from "../util/uuidv";
import SaveComponent from "./SaveComponent";

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
    isActive.current = true;
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
      isActive.current = true;
    } else if (!isCorrect && nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setWrongQuestions();
      isActive.current = true;
      setTotalTime(10);
    } else if (
      (totalTime === 0 && nextQuestion === questions.length) ||
      (!isCorrect && nextQuestion === questions.length) ||
      (isCorrect && nextQuestion === questions.length)
    ) {
      isActive.current = false;
      setGame("score");
      setCurrentQuestion(0);
    }
  };

  const countDownBarWith = {
    width: totalTime * 10,
  };

  useEffect(() => {
    let interval = null;
    if (isActive.current) {
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
  }, [isActive.current, totalTime]);

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
        >
          {questions[currentQuestion].code.replace(
            /(^"|"$)/g,

            ""
          )}
        </SyntaxHighlighter>

        <div className={styles.answer_section}>
          {questions[currentQuestion].answerOptions.map((answerOption) => (
            <button
              type="button"
              className={styles.answer}
              key={uudiv()}
              onClick={() =>
                handleAnswerOptionClick(
                  answerOption.isCorrect,
                  questions,
                  currentQuestion
                )
              }
            >
              {answerOption.answerText}
              {console.log("render")}
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
