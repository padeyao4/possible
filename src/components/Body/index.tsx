import { useModel } from 'umi';
import Node from '../Node';

const Body = () => {
  const { cols, rows } = useModel('data');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {[...new Array(rows).keys()].map((v1) => {
        return [...new Array(cols).keys()].map((v2) => {
          return (
            <Node key={v2 + '-' + v1} id={v1 * v2}>
              {v2 + '-' + v1}
            </Node>
          );
        });
      })}
    </div>
  );
};

export default Body;
