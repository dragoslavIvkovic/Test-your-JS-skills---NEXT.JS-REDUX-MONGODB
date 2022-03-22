import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { increment, reset } from '../store/reducers/counterSlice'

import { CopyBlock, dracula } from 'react-code-blocks'
import styles from '../styles/Qpage.module.css'

import shuffleArray from '../util/shuffle'
import uuidv from '../util/uuidv'
import { Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'

export default function Questions () {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)

  const [questions, setQuestions] = useState({})

  const [open, setOpen] = useState(true)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    dispatch(reset())
    setOpen(false)
  }


//   useEffect(() => {
//   const fetchQuestions = async () => {
//     const response = await fetch('/api/QApages')

//     const data = await response.json()
// fetchQuestions()
//     setQuestions(data)}
// }, []);
  

  const fetchQuestions = async () => {
    const response = await fetch('/api/QApages')

    const data = await response.json()

    setQuestions(data)
  }

  console.log('questions',   questions)

  const dispatch = useDispatch()
  const counter = useSelector(state => state.counter)
  const score = Object.values(counter)
  console.log(counter)
  const handleAnswerOptionClick = isCorrect => {
    if (isCorrect) {
      dispatch(increment())
    } else {
    }

    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowScore(true)
    }
  }

  const shuffle = () => 0.5 - Math.random()

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 800,
    bgcolor: 'red',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  }

  return (
    <div>
      <button onClick={fetchQuestions}> dfssdf </button>
      <div className={styles.container}>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography id='modal-modal-title' variant='h6' component='h2'>
                Click outside to start test
              </Typography>
              <Typography
                id='modal-modal-description'
                sx={{ mt: 2 }}
              ></Typography>
            </Box>
          </Modal>
        </div>

       
        <div className='app'>
          {showScore ? (
            <div className='score-section'>
              You scored {score} out of {questions.length}
            </div>
          ) : (
            <>
              <div>
                <div className='question-count'>
                  <span>Question {currentQuestion + 1}</span>/{questions.length}
                </div>
                <div className='question-text'>
                  {questions[currentQuestion].questionText}
                </div>
              </div>
              <CopyBlock
                language='javascript'
                text={JSON.stringify(questions[currentQuestion].code).replace(
                  /(^"|"$)/g,
                  ''
                )}
                theme={dracula}
                wrapLines={true}
                highlight='1'
                codeBlock
              /> 
              <div className={styles.answer_section}>
                {questions[currentQuestion].answerOptions
                  .sort(shuffle)
                  .map(answerOption => (
                    <button
                      className={styles.answer}
                      key={questions._id}
                      onClick={() =>
                        handleAnswerOptionClick(answerOption.isCorrect)
                      }
                    >
                      {answerOption.answerText}
                    </button>
                  ))}
              </div>
            </>
          )}
        </div> 
      </div>
    </div>
  )
}
