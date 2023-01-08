import styles from '../styles/Home.module.css'
import Content from '../components/content'

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.side}>
        <div>
          <div>today</div>
          <div>plan summer</div>
        </div>
        <hr />
        <div>
          <div>plan1</div>
          <div>plan2</div>
          <div>plan3</div>
          <div>plan4</div>
        </div>
        <hr />
        <div>
          create plan button
        </div>
      </div>
      <div className={styles.content}>
        <Content></Content>
      </div>
    </div>
  )
}
