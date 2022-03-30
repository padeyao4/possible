import { Project } from '@/core/model';
import { useState } from 'react';

export default () => {
  const [cols, setCols] = useState<number>(7);
  const [rows, setRows] = useState<number>(50);
  const [projects, setProjects] = useState<Project[]>([]);
  const [current, setCurrent] = useState<Date>(new Date());
  const [cursor, setCursor] = useState<Date>(new Date());

  /**
   * projects的索引,当projects长度为空时，index为null
   */
  const [index, setIndex] = useState<number | null>(null);

  return {
    cols,
    rows,
    projects,
    current,
    cursor,
    index,
    setCols,
    setRows,
    setProjects,
    setCurrent,
    setCursor,
    setIndex,
  };
};
