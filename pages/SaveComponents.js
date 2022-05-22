import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";

function SaveComponents(  collection, score) {
      const { data: session, status } = useSession();
 const [saved,setSaved] = useState(false)

    const submitForm = async (e) => {
    
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

  console.log(saved);
    
  return (
    <>
      {!saved ? (
        <button type="button" onClick={submitForm}>
          Do you wan to save
        </button>
      ) : (
         <p>Saved</p> 
      )}
    </>
  );
}

export default SaveComponents;
