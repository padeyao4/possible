import React from 'react';
import './index.css'

const BasicLayout: React.FC = props => {
  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: '280px auto',
      // background: 'pink'
    }}>
      <div style={{
        background: '#1C1C1C'
      }}>
        <p style={{
          color: 'white'
        }}>
          hello world
        </p>
      </div>
      <div style={{
        overflowY:'scroll'
      }}>
        {props.children}
      </div>
    </section>
  );
};

export default BasicLayout;
