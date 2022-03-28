import React from 'react';
import './index.css'

const BasicLayout: React.FC = props => {
  return (
<>
    {props.children}
</>
  );
};

export default BasicLayout;
