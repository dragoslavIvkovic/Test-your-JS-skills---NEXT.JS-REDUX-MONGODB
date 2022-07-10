import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/Elements.module.css";
import BtnSignIn from "../components/BtnSignIn";

function SaveComponent({ collection }) {
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

  return (
    <div className={styles.saveSection}>
      <p className={styles.scoreSection}>
        You scored&nbsp;
        {score}
      </p>

      {status === "unauthenticated" ? (
        <BtnSignIn />
      ) : (
        <p>
          {" "}
          {!saved ? (
            <button
              type="button"
              onClick={saveScore}
              className={styles.nextBtn}
            >
              Do you wan to save
            </button>
          ) : (
            <p className={styles.nextBtn}>Saved</p>
          )}
        </p>
      )}
    </div>
  );
}

export default SaveComponent;
