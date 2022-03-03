import React, { useEffect, useState } from 'react';

import useKeyPress from '../hooks/useKeyPress';
import generate from '../utils/text.json';
import { currentTime } from '../utils/time';
import Lesson from '../utils/lessons.json';

import styles from "../styles/Tutor.module.css";
import { Box, Modal, Typography } from '@mui/material';
import { QuestionComponetn } from '../QuestionComponents';

let x = JSON.stringify(generate);
const initialWords = x.slice(1, -1).replace(/"/g, '');

let y = JSON.stringify(Lesson);
const LessonNumber = y.slice(1, -1).replace(/"/g, '');
console.log(LessonNumber);

function App() {
  const [leftPadding, setLeftPadding] = useState(
    new Array(20).fill(' ').join(''),
  );
  const [outgoingChars, setOutgoingChars] = useState('');
  const [currentChar, setCurrentChar] = useState(initialWords.charAt(0));
  const [incomingChars, setIncomingChars] = useState(initialWords.substr(1));

  const [startTime, setStartTime] = useState();

  const [typedChars, setTypedChars] = useState('');

  const [open, setOpen] = useState(false);
  const [disable, setDisable] = useState(true);
  const [showLesson, setShowLesson] = useState(false);

  useKeyPress((key) => {
    if (!startTime) {
      setStartTime(currentTime());
    }

    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;
    if (key === currentChar) {
      if (leftPadding.length > 0) {
        setLeftPadding(leftPadding.substring(1));
      }
      updatedOutgoingChars += currentChar;
      setOutgoingChars(updatedOutgoingChars);

      setCurrentChar(incomingChars.charAt(0));

      updatedIncomingChars = incomingChars.substring(1);
      if (updatedIncomingChars.split(' ').length < 10) {
        updatedIncomingChars += ' ' + generate;
      }
      setIncomingChars(updatedIncomingChars);
    }
  });

  ///time

  // This is the startTimer in Milliseconds
  const startTimer = 60000;

  // Use this state value to hold how much time is remaining
  const [timeLeft, setTimeLeft] = useState(startTimer);

  // This state value holds whether the timer is paused or not
  const [isPaused, setIsPaused] = useState(false);

  // Used to indicated if the timer has been started or not
  const [isStarted, setIsStarted] = useState(false);

  // UseEffect hook runs every time one of our state values change,
  // and handles the countdown
  useEffect(() => {
    // this function gets called by the setTimeout function.
    // Whenever this function is called, we want to decrease the timeleft by 1000 milliseconds (or, 1 second)
    const countdown = () => {
      // we only want to decrease the timeleft if the timer is started AND the timer hasn't been paused
      if (isStarted && !isPaused) {
        setTimeLeft(timeLeft - 1000);
      }
    };

    // This is just the timeout function. every 1000 milliseconds, the countdown function gets called
    // we store the timeout function in a 'timer' variable so we can clear it later.
    const timer = setTimeout(countdown, 1000);

    // if isStarted is false, it means the timer hasn't been started (ie the app has just loaded)
    // or was reset
    // If this is the case, we want to set the time left to the default (startTimer) and we want to
    // clear the timer - setTimeout function stays present until the window was refreshed!
    if (isStarted === false) {
      setTimeLeft(startTimer);
      return clearTimeout(timer);
    }

    // if timeleft is 0, we want to clear the timer to stop it from running
    if (timeLeft === 0) {
      return clearTimeout(timer);
    }
  }, [isStarted, timeLeft, isPaused]); // <---- when these variables change, the useEffect hook will run!

  // Since the time remaining is in milliseconds, we want to format this to minutes
  const getMinutes = () => {
    let minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    // This just adds a "0" if the number is less than 10 for formatting purposes
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return minutes;
  };

  // Since the time remaining is in milliseconds, we want to format this to seconds. Returns a string
  const getSeconds = () => {
    let seconds = Math.floor((timeLeft / 1000) % 60);
    // This just adds a "0" if the number is less than 10 for formatting purposes
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return seconds;
  };

  // called when the "reset" button is clicked. This resets our state values, causing the
  // logic in the useEffect hook to rerun
  const resetTimer = () => {
    setIsPaused(false);
    setIsStarted(false);
  };

  useEffect(
    (e) => {
      if (timeLeft === 0) {
        setOpen(true);
        setIsPaused(true);
        setDisable(false);
      }
    },
    [timeLeft],
  );

  console.log(open);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    height: 200,
    textAlign: 'center',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className={styles.tutor}>
      {!isStarted ? (
        <div    className={styles.lessons_text}>
          {' '}
          <p>{LessonNumber}</p>{' '}
        </div>
      ) : null}

      <header    className={styles.tutor__header}>
        <div  className={styles.character}  >
          <p className={styles.text__p}> {`${getMinutes()}:${getSeconds()}`} </p>
          <span className={styles.characterOut}>
            {(leftPadding + outgoingChars).slice(-20)}
          </span>
          <span className={styles.charCurrent} >{currentChar}</span>
          <span>{incomingChars.slice(0, 30)}</span>
        </div>
        <div className={styles.button__ection}>
          {isStarted ? ( //here we just use a ternary to display different buttons/text, depending on the state values
            <>
              <button disabled={disable} onClick={resetTimer}>
                Reset
              </button>
              {/* <button onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? 'Resume' : 'Pause'}
              </button> */}
            </>
          ) : (
            <button onClick={() => setIsStarted(true)}>Start</button> //this button starts the timer, by changing the "isStarted" state variable
          )}
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <QuestionComponetn />
          </Box>
        </Modal>
      </header>
    </div>
  );
}

export default App;
