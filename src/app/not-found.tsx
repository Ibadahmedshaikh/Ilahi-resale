import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.emoji}>🚗</div>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.text}>
          The page you&apos;re looking for doesn&apos;t exist or the car may
          have been sold. Browse our current inventory below.
        </p>
        <div className={styles.actions}>
          <Link href="/cars" className="btn btn-primary btn-lg">
            Browse All Cars
          </Link>
          <Link href="/" className="btn btn-outline btn-lg">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
