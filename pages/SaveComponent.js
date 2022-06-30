import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';

import styles from '../styles/Elements.module.css';
import BtnSignIn from '../components/BtnSignIn';

function SaveComponent() {
  const { data: session, status } = useSession();
  const [saved, setSaved] = useState(false);
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);
  const score = Object.values(counter);
  const lev = useSelector((state) => state.levels);
  const setLevel = Object.values(lev);

  const saveScore = async (e) => {
    e.preventDefault();
    try {
      setSaved(true);
      // eslint-disable-next-line prefer-const
      let dev = process.env.NODE_ENV !== 'production';
      // eslint-disable-next-line prefer-const
      let { DEV_URL, PROD_URL } = process.env;

      // let res = await fetch('http://localhost:3000/api/usersAPI', {
      let res = await fetch(`${dev ? DEV_URL : PROD_URL}/api/usersAPI`, {
        method: 'POST',
        body: JSON.stringify({
          user: session.user.name,
          score: Number(score),
          avatar: session.user.image,
          level: setLevel[0],
        }),

      });
      res = await res.json();
    } catch (err) {
      setSaved(false);
    }
  };

  return (

    <div className={styles.saveSection}>
      <p className={styles.scoreSection}>
        You scored =&nbsp;
        {score}

      </p>

      {status === 'unauthenticated' ? (
        <BtnSignIn />
      ) : (
        <p>
          {' '}
          {!saved ? (
            <button type="button" onClick={saveScore} className={styles.nextBtn}>
              Do you wan to save ?
            </button>
          ) : (
            <p className={styles.saved}>Saved</p>
          )}

        </p>
      )}

    </div>
  );
}

export default SaveComponent;
