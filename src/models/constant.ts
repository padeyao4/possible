import { useState } from 'react';

export default () => {
  const [cols, setCols] = useState<number>(7);
  const [rows, setRows] = useState<number>(50);
  const [current, setCurrent] = useState<Date>(new Date());
  const [item, setItem] = useState<number>(0);

  return {
    cols,
    rows,
    current,
    item,
    setCols,
    setRows,
    setCurrent,
    setItem,
  };
};
