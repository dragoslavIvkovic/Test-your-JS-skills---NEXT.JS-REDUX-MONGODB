import React from 'react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "../styles/Elements.module.css";

function QuizComponent(currentQuestion,questions,answerOptions,answerOption,totalCount,barWidth) {
  return (
     <>
                        <div className={styles.questionCount}>
                          <p className={styles.questionText}>
                            What is the output?
                          </p>

                          <p className={styles.questionText}>
                            Question
                            {currentQuestion + 1}/{questions.length}
                          </p>
                        </div>

                        <div className={styles.code}>
                          <SyntaxHighlighter
                            language="javascript"
                            style={dracula}
                          >
                            {questions[currentQuestion].code.replace(
                              /(^"|"$)/g,
                              // eslint-disable-next-line quotes
                              ""
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
                          <span>
                            {totalCount.toFixed(0)}
                            sec
                          </span>
                        </div>
                        </>
  )
}

 




export default QuizComponent