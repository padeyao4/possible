import { CSSProperties } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

const Header = () => {
  const { getProjectByIndex } = useModel('project');
  const { cols } = useModel('constant');

  const cssStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    backgroundColor: 'skyblue',
  };

  return (
    <div className={styles.header}>
      <div>
        <div>{getProjectByIndex()?.goal}</div>
      </div>
      <div style={cssStyle}>
        {[...new Array(cols).keys()].map((v) => {
          return <div key={v}>{v}</div>;
        })}
      </div>
    </div>
  );
};

export default Header;
