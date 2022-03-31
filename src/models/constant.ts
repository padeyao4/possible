import { useState } from 'react';

export default () => {
  const [cols, setCols] = useState<number>(7);
  const [rows, setRows] = useState<number>(50);
  const [current, setCurrent] = useState<Date>(new Date());

  return {
    cols,
    rows,
    current,
    setCols,
    setRows,
    setCurrent,
  };
};
