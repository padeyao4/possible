import Content from "@/components/content";
import styles from './home.module.css';

const data = () => {
  const rs = []
  for (let i = 0; i < 50; i++) {
    rs.push(i)
  }
  return rs;
}

export default function HomePage() {

  return (
    <div className={styles.main}>
      <div className={styles.side}>
        <div className={styles.sideHeader}>
          <div className={styles.button}>today</div>
          <div className={styles.button}>plan summer</div>
          <hr className={styles.hr} />
        </div>
        <div className={styles.sideBody}>
          <div className={styles.sideBodyList}>
            {
              data().map((value, index) => {
                return <div className={styles.button} key={index}>{value}</div>
              })
            }
          </div>
        </div>
        <div className={styles.sideBottom}>
          <hr className={styles.hr} />
          <div className={styles.button}>create plan button</div>
        </div>
      </div>
      <div className={styles.content}>
        <Content></Content>
      </div>
    </div>)
}
