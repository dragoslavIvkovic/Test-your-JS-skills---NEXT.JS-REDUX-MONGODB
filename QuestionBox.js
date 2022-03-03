import { Button, List } from '@mui/material';
import classNames from 'classnames';
import { useEffect, useState } from 'react';


// login logout. keep 10questions in localstorgage + db and dashboard "new quiz" instead. ability to invite friend to the same quiz
const QuestionBox = ({ question, nextQuestion }) => {
  if (!question) return 'Loading...';

  const answers = [question.correct_answer, ...question.incorrect_answers];

  const [submittedIndex, setSubmittedIndex] = useState();
  // const [shuffledAnswers, setShuffledAnswers] = React.useState(
  //   shuffle(answers)
  // );

  const correctAnswerIndex = answers.indexOf(question.correct_answer);
  const submitted = submittedIndex !== undefined;

  useEffect(() => {
    setSubmittedIndex(undefined);
  }, [question]);

  const submitAnswer = (index) => {
    if (!submitted) {
      setSubmittedIndex(index);
    }
  };

  console.log(submittedIndex, correctAnswerIndex);
  return (
    <div>
      <div className="type">
        <div className="type-header">
          <div>
            <List>
              {answers.map((answer, index) => {
                return (
                  <Button onClick={() => submitAnswer(index)}>{answer}</Button>
                );
              })}
            </List>
          </div>
        </div>
        {submittedIndex === correctAnswerIndex && (
          <Button className="mt-3" variant="primary" onClick={nextQuestion}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionBox;
