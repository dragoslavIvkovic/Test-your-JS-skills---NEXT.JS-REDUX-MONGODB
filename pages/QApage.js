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
import uuidv from "../util/uuidv"

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
 
 
 


  
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowScore(true)
    }
  }

 const shuffle = () => 0.5 - Math.random();
 
 
  return (
    <div className={styles.container}>
      <div></div>
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
        />  {console.log(JSON.stringify(questions[currentQuestion].code).replace(/(^"|"$)/g, ''))}
 
            <div className={styles.answer_section}>
              {questions[currentQuestion].answerOptions.sort(shuffle).map(answerOption => (
                <button className={styles.answer}
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



function shuffleArray(d) {
  for (var c = d.length - 1; c > 0; c--) {
    var b = Math.floor(Math.random() * (c + 1));
    var a = d[c];
    d[c] = d[b];
    d[b] = a;
  }
  return d
};
   
 




  return {
    props: {
      questions: JSON.parse(JSON.stringify(shuffleArray(questions)))
    }
  }
}
