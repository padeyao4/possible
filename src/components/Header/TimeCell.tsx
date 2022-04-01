import { add } from '@/utils/dateUitls';
import moment from 'moment';
import { FunctionComponent } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

interface TimeCellProps {
  idx: number;
}

const TimeCell: FunctionComponent<TimeCellProps> = (props) => {
  const { cursor } = useModel('cusor');

  const date = add(cursor, props.idx);

  const week = date.getDay();

  return (
    <div className={styles.timeSheet}>
      <div>周{week == 0 ? '日' : week}</div>
      <div>{moment(date).format('YYYY年MM月DD日')}</div>
    </div>
  );
};

export default TimeCell;
