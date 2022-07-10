/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import styles from "../styles/Elements.module.css";
import BtnSignIn from "../components/BtnSignIn";
 

function SaveComponent({ collection,handleClick }) {
  const { data: session, status } = useSession();
  const [saved, setSaved] = useState(false);
  const [levels, setLevels] = useState("");
  const counter = useSelector((state) => state.counter);
  const score = Object.values(counter);

  useEffect(() => {
    setLevels(collection);
  }, [collection]);

  const saveScore = async (e) => {
    e.preventDefault();
    try {
      setSaved(true);
      console.log(collection);
      let res = await fetch("http://localhost:3000/api/usersAPI", {
        method: "POST",
        body: JSON.stringify({
          user: session.user.name,
          score: Number(score),
          avatar: session.user.image,
          level: levels,
        }),
      });
      res = await res.json();
    } catch (err) {
      console.log(err);
      setSaved(false);
    }
  };

  const updateStateProps = () => {
    handleClick('levels')
  }
  return (
    <div className={styles.saveSection}>
      <p className={styles.scoreSection}>
        You scored&nbsp;
        {score}
      </p>

      {status === "unauthenticated" ? (
        <>
          {" "}
          <p> If you want to save score. Sign in.</p>
          <BtnSignIn />
        </>
      ) : (
        <p>
          {!saved ? (
            <button
              type="button"
              onClick={saveScore}
              className={styles.nextBtn}
            >
              Do you wan to save
            </button>
          ) : (
            <>
              <p className={styles.nextBtn}>Saved</p>
              <button type="button" onClick={updateStateProps } className={styles.nextBtn}>Play Again</button></>
          )}
        </p>
      )}
    </div>
  );
}

export default SaveComponent;
