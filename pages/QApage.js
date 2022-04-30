import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { increment, reset } from "../store/reducers/counterSlice";
import {
  addWrongQuestions,
  selectWrongQuestions,
  wrongQuestions,
  resetWrongQuestions,
} from "../store/reducers/wrongQuestionsCounter";
import clientPromise from "../lib/mongodb";
// import { CopyBlock, dracula } from 'react-code-blocks';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useRouter } from "next/router";
import styles from "../styles/Qpage.module.css";

import shuffleArray from "../util/shuffle";

export default function Questions({ data }) {
  console.log(data);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const [questions, setQuestions] = useState({});
  const [collection, setCollection] = useState();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [wrongQ, setWrongQ] = useState([]);

  // total count accumulated
  const [totalCount, setTotalCount] = useState(20);

  const [width, setWidth] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchQuestions = () => {
    setQuestions(shuffleArray(data));
    setLoading(true);
    startFn();
    dispatch(reset());
    dispatch(resetWrongQuestions());
  };

  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);
  const wrongQuestion = useSelector((state) => state.wrongQuestions);
  const score = Object.values(counter);

  const nextQuestion = currentQuestion + 1;

  const handleAnswerOptionClick = (isCorrect, questions, currentQuestion) => {
    if (isCorrect && nextQuestion < questions.length) {
      dispatch(increment());

      setCurrentQuestion(nextQuestion);
      startFn();
    } else if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      startFn();

      setWrongQ((wrongQ) => [...wrongQ, questions[currentQuestion]._id]);
    } else {
      setIsActive(false);
      setShowScore(true);
    }
  };

  // const shuffle = () => 0.20 - Math.random()

  function startFn() {
    setIsActive(!isActive);
  }
  function clear() {
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTotalCount(20);
      setWrongQ((wrongQ) => [...wrongQ, questions[currentQuestion]._id]);
    } else if (nextQuestion < questions.length) {
      setWrongQ((wrongQ) => [...wrongQ, questions[currentQuestion]._id]);
    } else if (nextQuestion === questions.length) {
      setWrongQ((wrongQ) => [...wrongQ, questions[currentQuestion]._id]);
      startFn();
    }
  }

  const barWidth = {
    width: totalCount * 20,
  };

  useEffect(() => {
    let interval = null;

    // on initial render, the effect fn is called, but isActive is false so nothing happens
    // when i click "Start", isActive changes so the effect fn fires and the if statement kicks off an interval to increment the count.
    // each time the totalCount changes, we want the interval to run again so we need the effect fn to call again. add totalCount to the dependency array so the effect fn will fire on totalCount change.
    if (isActive) {
      interval = setInterval(() => {
        totalCount === 0 ? clear() : setTotalCount(totalCount - 1);
        setWidth(width - 20);
      }, 1000);
    } else if (nextQuestion === questions.length) {
      setIsActive(false);
      setShowScore(true);
      setWidth(100);
      dispatch(
        addWrongQuestions(
          data.filter((obj1) => wrongQ.find((obj2) => obj1.id === obj2.id))
        )
      );
      //  console.log("xx" , data.filter(obj1 => wrongQ.find(obj2 => obj1.id === obj2.id)))

      // } else {
      //   setIsActive(false)
      //   setShowScore(true)
      // }
    }
    // the clean up function will fire before running the effect fn again.
    // this way we only have 1 interval function running at a time.
    return () => clearInterval(interval);
  }, [isActive, totalCount]); // try with and without totalCount.

  console.log(data);

  useEffect(() => {
    if (collection !== router.query.collection) {
      router.push(`/QApage?collection=${collection}`);
    }
  }, [collection]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.block}>
          {collection === undefined ? (
            <div>
              {" "}
              <button
                className={styles.button}
                onClick={() => setCollection("questions")}
              >
                questions
              </button>
              <button
                onClick={() => setCollection("middle")}
                className={styles.button}
              >
                middle
              </button>
              <button
                onClick={() => setCollection("XXX")}
                className={styles.button}
              >
                xxx
              </button>
            </div>
          ) : (
            <div>
              {" "}
              {loading ? (
                <div className="app">
                  {showScore ? (
                    <div className="score-section">
                      <p>
                        You scored {score} out of {questions.length}
                      </p>
                      <button  >Do you wan to save</button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className={styles.questionCount}>
                          <span className={styles.questionText}>
                            <p>What is the output?</p>
                          </span>

                          <span className={styles.questionText}>
                            <p>
                              Question {currentQuestion + 1}/{questions.length}
                            </p>
                          </span>
                        </div>
                      </div>
                      <div className={styles.code}>
                        <SyntaxHighlighter
                          language="javascript"
                          style={dracula}
                        >
                          {questions[currentQuestion].code.replace(
                            /(^"|"$)/g,
                            ""
                          )}
                        </SyntaxHighlighter>
                      </div>

                      <div className={styles.answer_section}>
                        {questions[currentQuestion].answerOptions.map(
                          (answerOption) => (
                            <button
                              className={styles.answer}
                              key={questions._id}
                              onClick={() =>
                                handleAnswerOptionClick(
                                  answerOption.isCorrect,
                                  questions,
                                  currentQuestion
                                )
                              }
                            >
                              {answerOption.answerText}
                            </button>
                          )
                        )}
                      </div>
                      <div style={barWidth} className={styles.bar}>
                        <span>{totalCount.toFixed(0)}sec</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button onClick={fetchQuestions} className={styles.button}>
                  START
                </button>
              )}
            </div>
          )}

          <div></div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ query: { collection = "xxx" } }) {
  console.log(typeof collection, collection);

  const client = await clientPromise;

  const db = client.db("javascript_questions");

  let data = await db.collection(collection).find({}).toArray();
  data = JSON.parse(JSON.stringify(data));

  return {
    props: { data },
  };
}
