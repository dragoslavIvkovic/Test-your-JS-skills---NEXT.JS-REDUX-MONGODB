import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import styles from "../styles/Elements.module.css";
import { useSelector, useDispatch } from "react-redux";
import BtnSignIn from "../components/BtnSignIn";

function SaveComponent(  collection ,questions ) {
      const { data: session, status } = useSession();
 const [saved,setSaved] = useState(false)
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);
  const score = Object.values(counter);

  
    const saveScore = async (e) => {
        e.preventDefault();
          try {
        setSaved(true)
      let res = await fetch("http://localhost:3000/api/usersAPI", {
        method: "POST",
        body: JSON.stringify({
          user: session.user.name,
          score: Number(score),
          avatar: session.user.image,
          level: collection,
        }),
          
      });
      res = await res.json();
     
    } catch (err) {
      console.log(err);
     setSaved(false)
    }
  };

  console.log("save" ,score)
    
  return (
 
      <div className={styles.saveSection}>
                        <p className="score-section">
                          You scored
                          {score}
                          out of
                          {questions.length}
                        </p>
     

      {status === "unauthenticated" ? (
        <BtnSignIn />
      ) : (
       <p>  {!saved ? (
        <button type="button" onClick={saveScore}>
          Do you wan to save
        </button>
      ) : (
          <><p>Saved</p> 
           </>
      )}</p>
      )
 
 
 }

     
      </div>
  );
}

export default SaveComponent;
