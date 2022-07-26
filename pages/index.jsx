import Link from "next/link";
import styles from "../styles/Elements.module.css";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className={styles.container}>
            <Hero />
    </div>
  );
}
