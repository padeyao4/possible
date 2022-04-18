import { useCallback, useState } from 'react';

/**
 * 游标日期，表示用户关注的日期
 */
export default () => {
  const [cursor, setCursor] = useState<Date>(new Date());

  const tomorrow = useCallback(() => {
    cursor.setDate(cursor.getDate() + 1);
    setCursor(new Date(cursor));
  }, []);

  const yesterday = useCallback(() => {
    cursor.setDate(cursor.getDate() - 1);
    setCursor(new Date(cursor));
  }, []);

  const today = useCallback(() => {
    const date = new Date();
    cursor.setDate(date.getDate());
    setCursor(date);
  }, []);

  return {
    cursor,
    setCursor,
    yesterday,
    tomorrow,
    today,
  };
};
