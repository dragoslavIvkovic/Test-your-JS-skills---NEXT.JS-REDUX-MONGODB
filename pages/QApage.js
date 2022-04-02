import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { increment, reset } from '../store/reducers/counterSlice'

// import { CopyBlock, dracula } from 'react-code-blocks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import styles from '../styles/Qpage.module.css'

import shuffleArray from '../util/shuffle'
// import uuidv from '../util/uuidv'
import { Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'

export default function Questions () {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)

  const [questions, setQuestions] = useState({})
  const [collection, setCollection] = useState()
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(6)
  const [timerStared, setTimerStared] = useState(false)

  const [open, setOpen] = useState(true)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    dispatch(reset())
    setOpen(false)
  }



  const fetchQuestions = async () => {
    const response = await fetch(`/api/QApages?collection=${collection}`)
    const data = await response.json()
    setQuestions(shuffleArray(data))
    setLoading(true)
    setTimerStared(true)
  }

  const dispatch = useDispatch()
  const counter = useSelector(state => state.counter)
  const score = Object.values(counter)

  const handleAnswerOptionClick = isCorrect => {
    const nextQuestion = currentQuestion + 1
    if (isCorrect) {
     
      dispatch(increment())
     setCurrentQuestion(nextQuestion)
      // setTimerStared(true)
      setTimer(6)
    } else if (nextQuestion < questions.length) {
      
      setCurrentQuestion(nextQuestion)
      // setTimerStared(true)
      setTimer(6)
    } else {
      setShowScore(true)
      setTimerStared(false)
       setTimer(0)
    }
  }

  //   const nextQuestion = currentQuestion + 1
  //   if (nextQuestion < questions.length) {
  //     setCurrentQuestion(nextQuestion)
  //       setTimerStared(true)
  //       setTimer(6)
  //   } else {
  //     setShowScore(true)
  //      setTimerStared(false)
  //   }
  // }

  // const shuffle = () => 0.20 - Math.random()

  console.log(timer)

  useEffect(() => {
    const nextQuestion = currentQuestion + 1
    if (timer > 0 && timerStared) {
      setTimeout(() => setTimer(timer - 1), 1000)
    } else if (timer === 0 && nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      setTimerStared(true)
      setTimer(6)
    } else if (nextQuestion < questions.length) {
       setTimerStared(true)
        setTimer(6)
      setCurrentQuestion(nextQuestion)
    } else if (nextQuestion == questions.length) {
      setShowScore(true)
      setTimerStared(false)
       setTimer(0)
    }
  }, [timer, timerStared, currentQuestion ])

  return (
    <>
      <div className={styles.container}>
        <p>{timer}</p>
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
                              handleAnswerOptionClick(answerOption.isCorrect)
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
