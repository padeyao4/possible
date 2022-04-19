import { FunctionComponent } from 'react';
import './index.less';

interface NodeProps {
  id: number;
}

const Node: FunctionComponent<NodeProps> = (props) => {
  return <div className="node">{props.children}</div>;
};

export default Node;
