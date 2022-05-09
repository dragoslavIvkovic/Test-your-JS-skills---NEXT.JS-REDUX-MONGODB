import React, { useEffect, useState, useRef } from "react";

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
import { useSession } from "next-auth/react";
import shuffleArray from "../util/shuffle";
import Link from "next/link";

export default function Questions({ data, collectionALL }) {
  const { data: session, status } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const [questions, setQuestions] = useState({});
  const [collection, setCollection] = useState();
  // const [loading, setLoading] = useState(false);

  let loading = useRef(false);

  // const [isActive, setIsActive] = useState(false);
  let isActive = useRef(false);

  // total count accumulated
  const [totalCount, setTotalCount] = useState(10);

  // const [width, setWidth] = useState(100);
  let width = useRef(100);
  const router = useRouter();

  const fetchQuestions = () => {
    setQuestions(shuffleArray(data));
    loading.current = !loading.current;
    startFn();
    dispatch(reset());
    dispatch(resetWrongQuestions(0));
  };

  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);
  const wrongQuestion = useSelector((state) => state.wrongQuestions);
  const score = Object.values(counter);

  const nextQuestion = currentQuestion + 1;

  const handleAnswerOptionClick = (isCorrect, questions, currentQuestion) => {
    if (isCorrect && nextQuestion === questions.length) {
      dispatch(increment());
      isActive.current = true;
    } else if (isCorrect && nextQuestion < questions.length) {
      dispatch(increment());
      setCurrentQuestion(nextQuestion);
      isActive.current = true;
      setTotalCount(10);
    } else if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      isActive.current = true;
      setTotalCount(10);
      setWrongQuestions();
    } else if (nextQuestion == questions.length) {
      isActive.current = false;
      setShowScore(true);
      setWrongQuestions();
    }
  };

  // const shuffle = () => 0.10 - Math.random()

  function startFn() {
    isActive.current = !isActive.current;
  }

  function setWrongQuestions() {
    dispatch(addWrongQuestions(questions[currentQuestion]));
  }

  function clear() {
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTotalCount(10);
      setWrongQuestions();
    } else if (nextQuestion === questions.length) {
      setWrongQuestions();
      startFn();
      width.current = 100;
    }
  }

  const barWidth = {
    width: totalCount * 10,
  };

  useEffect(() => {
    let interval = null;

    if (isActive.current) {
      interval = setInterval(() => {
        totalCount === 0 ? clear() : setTotalCount(totalCount - 1);
        width.current = width - 10;
      }, 1000);
    } else if (nextQuestion === questions.length) {
      startFn();
      setShowScore(true);
    }

    return () => clearInterval(interval);
  }, [isActive.current, totalCount]);

  useEffect(() => {
    if (collection !== router.query.collection) {
      router.push(`/QApage?collection=${collection}`);
    }
  }, [collection]);

  let submitForm = async (e) => {
    loading.current = !loading.current;
    e.preventDefault();
    let res = await fetch("http://localhost:3000/api/usersAPI", {
      method: "POST",
      body: JSON.stringify({
        user: session.user.name,
        score: Number(score),
        avatar: session.user.image,
      }),
    });
    res = await res.json();
  };

  return (
    <>
      <div className={styles.container}>
        <div>
          {
            <div>
              {" "}
              {!session ? (
                <>
                  <p>Plase login before continue</p>

                  <Link href="/api/auth/signin">
                    <a className={styles.link}>
                      {session ? (
                        <>
                          Signed in as {session.user.email} <br />
                          <button onClick={() => signOut()}>Sign out</button>
                        </>
                      ) : (
                        <>
                          Not signed in <br />
                          <button onClick={() => signIn()}>Sign in</button>
                        </>
                      )}
                    </a>
                  </Link>
                </>
              ) : (
                <div className={styles.block}>
                  {collection === undefined ? (
                    <div>
                      {collectionALL.map((x) => {
                        return (
                          <>
                            <button onClick={() => setCollection(x.name)}>
                              {x.name}
                            </button>
                          </>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      {" "}
                      {loading.current ? (
                        <div className="app">
                          {showScore ? (
                            <div className="score-section">
                              <p>
                                You scored {score} out of {questions.length}
                              </p>
                              <div>
                                <button onClick={submitForm}>
                                  Do you wan to save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className={styles.questionCount}>
                                  <span className={styles.questionText}>
                                    <p>What is the output?</p>
                                  </span>

                                  <span className={styles.questionText}>
                                    <p >
                                      Question {currentQuestion + 1}/
                                      {questions.length}
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
                        <button
                          onClick={fetchQuestions}
                          className={styles.button}
                        >
                          START
                        </button>
                      )}
                    </div>
                  )}

                  <div></div>
                </div>
              )}
            </div>
          }
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ query: { collection = "xxx" } }) {
  const client = await clientPromise;

  const db = client.db("javascript_questions");
  let data = await db.collection(collection).find({}).toArray();
  data = JSON.parse(JSON.stringify(data));

  let collectionALL = await db.listCollections().toArray();
  collectionALL = JSON.parse(JSON.stringify(collectionALL));

  return {
    props: { data, collectionALL },
  };
}
