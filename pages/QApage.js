import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { increment, reset } from '../store/reducers/counterSlice'
import { addWrongQuestions,selectWrongQuestions,wrongQuestions } from '../store/reducers/wrongQuestionsCounter'

// import { CopyBlock, dracula } from 'react-code-blocks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import styles from '../styles/Qpage.module.css'

import shuffleArray from '../util/shuffle'
 

export default function Questions () {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)

  const [questions, setQuestions] = useState({})
  const [collection, setCollection] = useState()
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(false)

  // total count accumulated
  const [totalCount, setTotalCount] = useState(5)

  // const [open, setOpen] = useState(true)
  // const handleOpen = () => setOpen(true)
  // const handleClose = () => {
  //   dispatch(reset())
  //   setOpen(false)
  // }

  const fetchQuestions = async () => {
    const response = await fetch(`/api/QApages?collection=${collection}`)
    const data = await response.json()
    setQuestions(shuffleArray(data))
    setLoading(true)
    startFn()
    dispatch(reset())
  }

  const dispatch = useDispatch()
  const counter = useSelector(state => state.counter)
  const wrongQuestion = useSelector(state => state.wrongQuestions )
  const score = Object.values(counter)


  const nextQuestion = currentQuestion + 1

  const handleAnswerOptionClick = (isCorrect,questions,currentQuestion) => {
    if (isCorrect) {
      
      dispatch(increment())
      
      setCurrentQuestion(nextQuestion)
      startFn()
      
    } else if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      startFn()
      dispatch(addWrongQuestions(questions[currentQuestion]._id  ))
    } else {
      setIsActive(false)
      setShowScore(true)
    }
  }

  // const shuffle = () => 0.20 - Math.random()

  function startFn () {
    setIsActive(!isActive)
  }
  function clear () {
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      setTotalCount(5)
    } else if (nextQuestion === questions.length) {
      startFn()
    }
  }

  useEffect(() => {
    let interval = null

    // on initial render, the effect fn is called, but isActive is false so nothing happens
    // when i click "Start", isActive changes so the effect fn fires and the if statement kicks off an interval to increment the count.
    // each time the totalCount changes, we want the interval to run again so we need the effect fn to call again. add totalCount to the dependency array so the effect fn will fire on totalCount change.
    if (isActive) {
      interval = setInterval(() => {
        totalCount === 0 ? clear() : setTotalCount(totalCount - 1)
      }, 1000)
    } else if (nextQuestion === questions.length) {
      setIsActive(false)
      setShowScore(true)

      // } else {
      //   setIsActive(false)
      //   setShowScore(true)
      // }
    }
    // the clean up function will fire before running the effect fn again.
    // this way we only have 1 interval function running at a time.
    return () => clearInterval(interval)
  }, [isActive, totalCount]) // try with and without totalCount.

 console.log("wrongQuestion" ,wrongQuestion)

  return (
    <>
      <div className={styles.container}>
        <p>{totalCount} </p>
        {collection === undefined ? (
          <div>
            {' '}
            <button onClick={() => setCollection('questions')}>
              questions
            </button>
            <button onClick={() => setCollection('middle')}>middle</button>
            <button onClick={() => setCollection('XXX')}>xxx</button>
          </div>
        ) : (
          <div>
            {' '}
            {loading ? (
              <div className='app'>
                {showScore ? (
                  <div className='score-section'>
                    You scored {score} out of {questions.length}
                  </div>
                ) : (
                  <>
                    <div>
                      <div className='question-count'>
                        <span>Question {currentQuestion + 1}</span>/
                        {questions.length}
                      </div>
                      <div className='question-text'>
                        {questions[currentQuestion].questionText}
                      </div>
                    </div>
                    <SyntaxHighlighter language='javascript' style={dracula}>
                      {questions[currentQuestion].code.replace(/(^"|"$)/g, '')}
                    </SyntaxHighlighter>
                    <div className={styles.answer_section}>
                      {questions[currentQuestion].answerOptions.map(
                        answerOption => (
                          <button
                            className={styles.answer}
                            key={questions._id}
                            onClick={() =>
                handleAnswerOptionClick(answerOption.isCorrect,questions,currentQuestion)

                            }
                          >
                            {answerOption.answerText}
                          </button>
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={fetchQuestions}>START</button>
            )}
          </div>
        )}

        <div></div>
      </div>
    </>
  )
}
