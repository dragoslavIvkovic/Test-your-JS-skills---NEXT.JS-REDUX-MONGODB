import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { increment, reset } from '../store/reducers/counterSlice'
import { addWrongQuestions,selectWrongQuestions,wrongQuestions,resetWrongQuestions } from '../store/reducers/wrongQuestionsCounter'

// import { CopyBlock, dracula } from 'react-code-blocks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import styles from '../styles/Qpage.module.css'

import shuffleArray from '../util/shuffle'

 import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Questions () {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)
   

  const [questions, setQuestions] = useState({})
  const [collection, setCollection] = useState()
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [wrongQ, setWrongQ] = useState([])

  // total count accumulated
  const [totalCount, setTotalCount] = useState(20)
  const { data, error,  } = useSWR(`/api/QApages?collection=${collection}`, fetcher)
  
  const [width, setWidth] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions =  () => {
     
    setQuestions(shuffleArray(data))
    setLoading(true)
    startFn()
    dispatch(reset())
    dispatch(resetWrongQuestions())
  }

  const dispatch = useDispatch()
  const counter = useSelector(state => state.counter)
  const wrongQuestion = useSelector(state => state.wrongQuestions )
  const score = Object.values(counter)
 


  const nextQuestion = currentQuestion + 1

  const handleAnswerOptionClick = (isCorrect,questions,currentQuestion) => {
    if (isCorrect && nextQuestion < questions.length ) {
      
      dispatch(increment())
      
      setCurrentQuestion(nextQuestion)
      startFn()
      
    } else if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      startFn()
   
      setWrongQ(wrongQ => [...wrongQ, questions[currentQuestion]._id])
    } else {
       
      setIsActive(false)
      setShowScore(true)
       console.log("xx" , data.filter(obj1 => wrongQ.find(obj2 => obj1.id === obj2.id)))
    }
  }

  // const shuffle = () => 0.20 - Math.random()

  function startFn () {
    setIsActive(!isActive)
  }
  function clear () {
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      setTotalCount(20)
      setWrongQ(wrongQ => [...wrongQ, questions[currentQuestion]._id])
    } else if (nextQuestion < questions.length   ) {
     setWrongQ(wrongQ => [...wrongQ, questions[currentQuestion]._id])
         
    } else if (nextQuestion === questions.length) {
       setWrongQ(wrongQ => [...wrongQ, questions[currentQuestion]._id])
      startFn()
    
    } 
    // else   {
    //   console.log("xx" , data.filter(obj1 => wrongQ.find(obj2 => obj1.id === obj2.id)))
    // }
  }


  const styles = {
    backgroundColor: "#00cb78",
    width: totalCount * 20
  };

  useEffect(() => {
    let interval = null

    // on initial render, the effect fn is called, but isActive is false so nothing happens
    // when i click "Start", isActive changes so the effect fn fires and the if statement kicks off an interval to increment the count.
    // each time the totalCount changes, we want the interval to run again so we need the effect fn to call again. add totalCount to the dependency array so the effect fn will fire on totalCount change.
    if (isActive  ) {
      interval = setInterval(() => {
        totalCount === 0 ? clear() : setTotalCount(totalCount - 1) ;
        setWidth(width - 20);
      }, 1000)


      
    } else if (nextQuestion === questions.length) {
      setIsActive(false)
      setShowScore(true)
      setWidth(100)
      dispatch(addWrongQuestions(data.filter(obj1 => wrongQ.find(obj2 => obj1.id === obj2.id))))
      //  console.log("xx" , data.filter(obj1 => wrongQ.find(obj2 => obj1.id === obj2.id)))

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
 console.log("wrongQ" ,wrongQ)
//  console.log("xx" , data.filter(obj1 => wrongQ.find(obj2 => obj1.id === obj2.id))





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
            { loading ? (
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
                       <div style={styles}>
          <span>{totalCount.toFixed(0)}%</span>
        </div>
                      <div className='question-text'>
                       <p>What is the output?</p> 
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
