/* eslint-disable no-underscore-dangle */
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Elements.module.css';
import clientPromise from '../lib/mongodb';
import uuidv from '../util/uuidv';

export default function scoreHeader({ users }) {

  console.log( users)
 

  return (
    <div className={styles.containerIndex}>
      <Head>
        <title> </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
       
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
