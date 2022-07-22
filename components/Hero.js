import React from "react";
import styles from "../styles/Hero.module.css";

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.box}>
        Test your programming knowledge.The application works like a quiz.
        Solving coding challenges every day as well as reviewing code makes you
        a better programmer.
      </div>
      <div className={styles.box}>
        When you select a difficulty level. The application randomly gives ten
        questions. For each question you are offered answers and time to answer.
        If you do not answer, it is counted as a wrong answer and the
        application moves to the next question.
      </div>
      <div className={styles.box}>
        When you finish the test, you get a view of the points won, the option
        to play again or to go to wrong answers. On Answers you can see the
        correct answers as well as the explanation, that&apos;s why. That way
        you learn new things.
      </div>
      <div className={styles.box}>
        The report button is used to send if you notice an error in the system,
        coding issues or your suggestion on how to improve the application.
      </div>
    </div>
  );
}

export default Hero;
