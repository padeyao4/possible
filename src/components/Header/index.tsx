import React, { CSSProperties } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

const Header = () => {
  const { cols, cursor, setCursor, index, projects } = useModel('data');

  const cssStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    backgroundColor: 'skyblue',
  };

  const handleMoveLeft = () => {
    cursor.setDate(cursor.getDate() - 1);
    setCursor(new Date(cursor));
  };

  const handleMoveRight = () => {
    cursor.setDate(cursor.getDate() + 1);
    setCursor(new Date(cursor));
  };

  return (
    <div className={styles.header}>
      <div>
        <button onClick={handleMoveLeft}>left</button>
        <button onClick={handleMoveRight}>right</button>
        <div>{index != null ? projects[index].goal : ''}</div>
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
