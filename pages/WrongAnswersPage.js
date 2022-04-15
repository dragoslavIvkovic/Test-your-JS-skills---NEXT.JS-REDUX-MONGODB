import React, { useEffect, useState } from 'react'
import styles from '../styles/WrongAnswersPage.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { CopyBlock, dracula } from 'react-code-blocks'

function WrongAnswersPage () {
  const [currentQuestions, setCurrentQuestion] = useState(0)
  const wrongQuestion = useSelector(state => state.wrongQuestions)
  const x = Object.values(wrongQuestion)
  const wrongQ = x.flat(2)
  console.log(
    'r',
    wrongQ[currentQuestions].answerOptions.filter(x => x.isCorrect)
  )
  console.log(
    't',
    wrongQ[currentQuestions].answerOptions.filter(x => x)
  )

  const nextQ = () => {
    const nextQuestion = currentQuestions + 1
    if (nextQuestion < wrongQ.length) {
      setCurrentQuestion(nextQuestion)
    } else {
    }
  }

  console.log([0].answerOptions)

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.code}>
          {!wrongQ.length ? (
            'you answered everting'
          ) : (
            <div>
              <CopyBlock
                language='javascript'
                text={wrongQ[currentQuestions]?.code}
                theme={dracula}
              
              
                showLineNumbers={false}
                highlight='1 -10'
                codeBlock
              />

              <p>{wrongQ[currentQuestions]?.answer}</p>
              <p>{wrongQ[currentQuestions]?.answerText}</p>
              {/* <p>{  wrongQ[currentQuestions].answerOptions.filter(x => x.isCorrect  === true && x.answerText  )}</p> */}
              <p>
                {wrongQ[currentQuestions].answerOptions.find(x =>
                  x === true ? x.answerText : 0
                )}
              </p>
            </div>
          )}
        </div>
        <button onClick={nextQ}>next</button>
      </div>
    </div>
  )
}

export default WrongAnswersPage
