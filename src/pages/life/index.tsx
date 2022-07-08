import Body from '@/components/Body';
import Header from '@/components/Header';
import { useModel } from 'umi';
import styles from './index.less';

function Page() {
  const { yesterday, tomorrow, today } = useModel('cusor');
  return (
    <div className={styles.content}>
      <Header />
      <Body />
      <div className={styles.footer}>
        <div onClick={today}>回到今天</div>
        <div onClick={yesterday}>左</div>
        <input type="range" max="100" min="1" defaultValue="50"></input>
        <div onClick={tomorrow}>右</div>
        <div>日期选择</div>
      </div>
    </div>
  );
}

export default Page;
