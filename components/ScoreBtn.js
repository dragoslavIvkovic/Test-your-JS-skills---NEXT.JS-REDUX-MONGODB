import { useRouter } from 'next/router';

function ScoreBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.push('/SaveComponent')} type="button">
      See score
    </button>
  );
}

export default ScoreBtn;
