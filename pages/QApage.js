import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import {
  incrementByAmount,
  increment,
  reset
} from '../store/reducers/counterSlice'
import { connectToDatabase } from '../util/mongodb'

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

  return (
    <div>
      <div></div>
      {/* <button onClick={handleStartTest}>Start test</button> */}
      <div className='app'>
        {showScore ? (
          <div className='score-section'>
            You scored {score} out of {questions.length}
          </div>
        ) : (
          <>
            <div className='question-section'>
              <div className='question-count'>
                <span>Question {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className='question-text'>
                {questions[currentQuestion].questionText}
              </div>
            </div>
            <div className='answer-section'>
              {questions[currentQuestion].answerOptions.map(answerOption => (
                <button
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
