import { CSSProperties } from 'react';
import { useModel } from 'umi';
import styles from './index.less';
import TimeCell from './TimeCell';

const Header = () => {
  const { getProjectByIndex } = useModel('project');
  const { cols } = useModel('constant');

  const cssStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
  };

  return (
    <div className={styles.header}>
      <div>
        <div className={styles.title}>{getProjectByIndex()?.goal}</div>
      </div>
      <div style={cssStyle}>
        {[...new Array(cols).keys()].map((v) => {
          return <TimeCell key={v} idx={v} />;
        })}
      </div>
    </div>
  );
};

export default Header;
