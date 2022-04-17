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
  const { current } = useModel('constant');
  const { cursor } = useModel('cusor');

  const date = add(cursor, props.idx);

  const getColor = () => {
    return moment(date).isSame(current, 'days') ? 'skyblue' : '#cccccc';
  };

  return (
    <div className={styles.timeSheet}>
      <div style={{ color: getColor() }}>周{mapper.get(date.getDay())}</div>
      <div style={{ color: getColor() }}>
        {moment(date).format('YYYY-MM-DD')}
      </div>
    </div>
  );
};

export default TimeCell;
