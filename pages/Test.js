import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useRouter } from "next/router";
import { increment, reset } from "../store/reducers/counterSlice";
import {
  addWrongQuestions,
  resetWrongQuestions,
} from "../store/reducers/wrongQueCounterSlice";
import { v4 as uuid } from "uuid";
import clientPromise from "../lib/mongodb";
import styles from "../styles/Elements.module.css";
import SaveComponent from "./SaveComponent";

export default function Questions({ data }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState({});
  const [collection, setCollection] = useState();
   const width = useRef(100);
  const router = useRouter();
  const dispatch = useDispatch();
  const [game, setGame] = useState("levels");
  const initCount = 6;
  const [totalTime, setTotalTime] = useState(initCount);
  const timerId = useRef();

  const handleClick = (gameState) => {
    setGame(gameState);
  };

  const setWrongQuestions = useCallback(() => {
    dispatch(addWrongQuestions(questions[currentQuestion]));
  }, [currentQuestion, dispatch, questions]);

  const fetchQuestions = () => {
    setQuestions(data);
       dispatch(reset());
    dispatch(resetWrongQuestions(0));
    setGame("test");
    handleStart();
  };

  const nextQuestion = currentQuestion + 1;

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect && nextQuestion < questions.length) {
      dispatch(increment());
      handleReset();
    } else if (!isCorrect && nextQuestion < questions.length) {
      setWrongQuestions();
      handleReset();
    } else if (!isCorrect && nextQuestion === questions.length) {
      handleStop();
    } else if (isCorrect && nextQuestion === questions.length) {
      handleStop();
    }
  };

  useEffect(() => {
    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (totalTime === -1) {
      setWrongQuestions();
      setCurrentQuestion(nextQuestion);
      handleReset();
    } else if (totalTime === 0 && nextQuestion === questions.length) {
      handleStop();
    }
  }, [
    handleReset,
    handleStop,
    nextQuestion,
    questions.length,
    setWrongQuestions,
    totalTime,
  ]);

  const countDownBarWith = {
    width: totalTime * 10 + "%",
  };

  function handleStart() {
    if (!timerId.current) {
      timerId.current = setInterval(() => {
        setTotalTime((pre) => pre - 1);
        width.current = width - 10;
      }, 1000);
    } else if (totalTime === 0 && nextQuestion === questions.length) {
      handleStop();
    }
  }

  const handleStop = useCallback(
    (isCorrect) => {
      clearInterval(timerId.current);
      timerId.current = null;
      if (!isCorrect && nextQuestion === questions.length) {
        setWrongQuestions();
        setGame("score");
        setCurrentQuestion(0);
      } else if (isCorrect && nextQuestion === questions.length) {
        dispatch(increment());
        setGame("score");
        setCurrentQuestion(0);
      }
    },
    [dispatch, nextQuestion, questions.length, setWrongQuestions]
  );

  const handleReset = useCallback(() => {
    setTotalTime(initCount);
    setCurrentQuestion(nextQuestion);
  }, [nextQuestion]);

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
        key={uuid()}
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
              key={uuid()}
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
        {totalTime.toFixed(0)}
        sec
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
