import { add } from '@/utils/dateUitls';
import moment from 'moment';
import { FunctionComponent } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

const mapper = new Map([
  [0, '日'],
  [1, '一'],
  [2, '二'],
  [3, '三'],
  [4, '四'],
  [5, '五'],
  [6, '六'],
]);
interface TimeCellProps {
  idx: number;
}

const TimeCell: FunctionComponent<TimeCellProps> = (props) => {
  const { cursor } = useModel('cusor');

  const date = add(cursor, props.idx);

  const week = date.getDay();

  return (
    <div className={styles.timeSheet}>
      <div>周{mapper.get(week)}</div>
      <div>{moment(date).format('YYYY-MM-DD')}</div>
    </div>
  );
};

export default TimeCell;
