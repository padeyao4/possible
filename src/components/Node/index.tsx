import React, { FunctionComponent } from 'react';
import styles from './index.less';

interface NodeProps {
  id: number;
}

const Node: FunctionComponent<NodeProps> = (props) => {
  return <div className={styles.node}>{props.children}</div>;
};

export default Node;
