import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import {
   
  increment,
  reset
} from '../store/reducers/counterSlice'
import { connectToDatabase } from '../util/mongodb'
import { CopyBlock, dracula } from 'react-code-blocks'
import styles from '../styles/Qpage.module.css'
 
import shuffleArray from '../util/shuffle'
import uuidv from '../util/uuidv'
import { Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'

export default function Questions ({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)

  const [open, setOpen] =  useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
     dispatch(reset())
   setOpen(false);
  }

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
  p: 4,
};



  return (
    <div className={styles.container}>
      <div>
 <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
           Click outside to start test
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            
          </Typography>
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
            />{' '}
            {console.log(
              JSON.stringify(questions[currentQuestion].code).replace(
                /(^"|"$)/g,
                ''
              )
            )}
            <div className={styles.answer_section}>
              {questions[currentQuestion].answerOptions
                .sort(shuffle)
                .map(answerOption => (
                  <button
                    className={styles.answer}
                    key={uuidv()}
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
  )
}

export async function getStaticProps () {
  const { db } = await connectToDatabase()

  const questions = await db
    .collection('questions')
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray()

  return {
    props: {
      questions: JSON.parse(JSON.stringify(shuffleArray(questions)))
    }
  }
}
