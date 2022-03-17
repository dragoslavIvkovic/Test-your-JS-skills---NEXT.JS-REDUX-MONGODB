import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import {
  incrementByAmount,
  increment,
  reset
} from '../store/reducers/counterSlice'
import { connectToDatabase } from '../util/mongodb'
import { CopyBlock, dracula } from "react-code-blocks";
import styles from '../styles/Qpage.module.css'
import {shuffle} from '../util/shuffle'

export default function Questions ({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)

  const dispatch = useDispatch()
  const counter = useSelector(state => state.counter)
  const score = Object.values(counter)

  const handleAnswerOptionClick = isCorrect => {
    if (isCorrect) {
      dispatch(increment())
    }

   





  
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowScore(true)
    }
  }


  console.log(score)
  function uuidv4 () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  // const handleStartTest = () => {
  // dispatch(reset())
   
  // }
 

  console.log(currentQuestion)
  return (
    <div className={styles.container}>
      <div></div>
      {/* <button onClick={handleStartTest}>Start test</button> */}
      <div className='app'>
        {showScore ? (
          <div className='score-section'>
            You scored {score} out of {questions.length}
          </div>
        ) : (
          <>
            <div >
              <div className='question-count'>
                <span>Question {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className='question-text'>
                {questions[currentQuestion].questionText}
              </div>
            </div>
             <CopyBlock
          language='javascript'
          text={JSON.stringify(questions[currentQuestion].code).replace(/(^"|"$)/g, '')}
           
          theme={dracula}
          wrapLines={true}
            highlight="1"
          codeBlock
        />
            <div className={styles.answer_section}>
              {questions[currentQuestion].answerOptions.map(answerOption => (
                <button className={styles.answer}
                  key={uuidv4()}
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
      questions: JSON.parse(JSON.stringify(questions))
    }
  }
}
