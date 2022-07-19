import Link from "next/link";
import styles from "../styles/Elements.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Link href="/Test">
            <a className={styles.link}>SKIP TUTORIAL</a>
          </Link>
    </div>
  );
}
