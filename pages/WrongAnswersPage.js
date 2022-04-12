import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'


function WrongAnswersPage () {
  const [currentQuestions, setCurrentQuestion] = useState(0)
  const wrongQuestion = useSelector(state => state.wrongQuestions)
 const x =    Object.values(wrongQuestion)   
 const wrongQ = x.flat(2);
 console.log(!wrongQ.length   )   

  
 const  nextQ = () => {
   const nextQuestion = currentQuestions + 1;
 if (nextQuestion < wrongQ.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      
    }
  };
  
  




  return <div>
  <div><p>{!wrongQ.length ? "you answered everting" : wrongQ[currentQuestions]?.code }</p><button onClick={nextQ}>next</button></div>
  
  
  </div>
}

export default WrongAnswersPage
