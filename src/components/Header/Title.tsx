import { Project } from '@/core/types';
import { createRef, FunctionComponent, useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

enum TitleState {
  show = 0,
  edit = 1,
}

interface TitleProps {}

const Title: FunctionComponent<TitleProps> = (props) => {
  const [state, setState] = useState(TitleState.show);
  const { getProjectByIndex, setProjectInfoByIndex } = useModel('project');
  const inputRef = createRef<HTMLInputElement>();

  const handleDoubleClick = () => {
    setState(TitleState.edit);
  };

  const handleOnChange = (e: string) => {
    setProjectInfoByIndex({ goal: e } as Project);
  };

  const handleInputOnAbort = () => {
    setState(TitleState.show);
  };

  const handleKenEnterDown = (code: string) => {
    if (code == 'Enter') {
      // enter down
      setState(TitleState.show);
    }
  };

  useEffect(() => {
    if (state == TitleState.edit) {
      inputRef.current?.focus();
    }
  }, [state]);

  return (
    <>
      {state == TitleState.show ? (
        <div className={styles.title} onDoubleClick={handleDoubleClick}>
          {getProjectByIndex()?.goal}
        </div>
      ) : (
        <input
          ref={inputRef}
          type="text"
          className={styles.title}
          value={getProjectByIndex()?.goal}
          onChange={(e) => handleOnChange(e.target.value)}
          onKeyDown={(e) => handleKenEnterDown(e.code)}
          onBlur={handleInputOnAbort}
        />
      )}
    </>
  );
};

export default Title;
