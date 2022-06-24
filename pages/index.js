/* eslint-disable no-underscore-dangle */
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Elements.module.css';
import clientPromise from '../lib/mongodb';
import uuidv from '../util/uuidv';

export default function Home({ users }) {
  const beginnerSample = users.filter((user) => user.level === 'beginnerSample');
  const hardcoreSample = users.filter((user) => user.level === 'hardcoreSample');
  const middleSample = users.filter((user) => user.level === 'middleSample');
  // const hard = hardcore.map((x) => x.score).sort((a, b) => b - a);
  const beginner = beginnerSample.sort((a, b) => (a.score > b.score ? -1 : 1));
  const hardcore = hardcoreSample.sort((a, b) => (a.score > b.score ? -1 : 1));
  const middle = middleSample.sort((a, b) => (a.score > b.score ? -1 : 1));

  return (
    <div className={styles.containerIndex}>
      <Head>
        <title> </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.leaderBoard}>
        <div className={styles.levelContainer}>
          <p className={styles.levelTitle}>beginners</p>
          {beginner?.map((x) => (
            <div className={styles.containerUser}>
              <Image alt="img" src={x.avatar} width="30px" height="30px" />
              <p key={uuidv()} className={styles.level}>
                {x.user}
              </p>
              <p key={uuidv()} className={styles.score}>
                {x.score}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.levelContainer}>
          <p className={styles.levelTitle}>intermediate</p>
          {middle?.map((x) => (
            <div className={styles.containerUser}>
              <Image alt="img" src={x.avatar} width="30px" height="30px" />
              <p key={uuidv()} className={styles.level}>
                {x.user}
              </p>
              <p key={uuidv()} className={styles.score}>
                {x.score}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.levelContainer}>
          <p className={styles.levelTitle}>hardcore</p>
          {hardcore?.map((x) => (
            <div className={styles.containerUser}>
              <Image alt="img" src={x.avatar} width="30px" height="30px" />
              <p key={uuidv()} className={styles.level}>
                {x.user}
              </p>
              <p key={uuidv()} className={styles.score}>
                {x.score}
              </p>
            </div>
          ))}
        </div>
      </main>
      <footer />
    </div>
  );
}

export async function getServerSideProps() {
  const client = await clientPromise;

  // eslint-disable-next-line no-unused-vars
  const db = client.db('leaderBoard');

  const res = await fetch('http://localhost:3000/api/usersAPI', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const users = await res.json();

  return {
    props: { users },
  };
}
