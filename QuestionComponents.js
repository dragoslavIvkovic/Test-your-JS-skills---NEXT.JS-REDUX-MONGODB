import React, { useEffect, useState } from 'react';

 
import QuestionBox from './QuestionBox';

// nex previous,  ohne veränderbarkeit
export function QuestionComponetn() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);

  const nextQuestion = () =>
    setQuestionIndex((questionIndex) => questionIndex + 1);

  useEffect(() => {
    fetch(
      'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple',
    )
      .then((res) => res.json())
      .then((json) => setQuestions(json.results));
  }, []);

  return (
    <div className="App">
      <div>
        <div>Question {questionIndex + 1}/10</div>

        <QuestionBox
          question={questions[questionIndex]}
          nextQuestion={nextQuestion}
        />
      </div>{' '}
    </div>
  );
}
