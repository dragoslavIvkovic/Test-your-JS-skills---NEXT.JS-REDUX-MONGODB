import { useRouter } from 'next/router';import styles from '../styles/Elements.module.css';

function ScoreBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.push('/SaveComponent')} type="button" className={styles.nextBtn}>
      See score
    </button>
  );
}

export default ScoreBtn;
