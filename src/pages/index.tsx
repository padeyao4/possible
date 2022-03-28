import Node from '@/components/Node';
import { Divider } from 'antd';
import React, { CSSProperties, useState } from 'react';
import { Model } from '../models/model';
import styles from './index.less'


export default function () {

  const [model, setModel] = useState(new Model())

  const Header = () => (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 99
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${model.cols}, 1fr)`,
        backgroundColor: "skyblue"
      }}>
        {
          [...new Array(model.cols).keys()].map((v) => {
            return <div key={v}>
              {v}
            </div>
          })
        }
      </div >
    </div>
  )

  const Body = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${model.cols}, 1fr)`
    }}>
      {
        [...new Array(model.rows).keys()].map((v1) => {
          return [...new Array(model.rows).keys()].map(v2 => {
            return <Node key={v2 + "-" + v1} id={v1 * v2}>{v2 + "-" + v1}</Node>;
          })
        })
      }
    </div>
  )


  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: '280px auto'
    }}>
      <div className={styles.leftSide}>
        <div>
          <div>
            <div className={styles.myButton}>
              我的一天
            </div>
          </div>
          <hr className={styles.myHr} />
          <div>
            projects
          </div>
        </div>
        <div >
          <div className={styles.myButton}>
            新建项目
          </div>
        </div>
      </div>
      <div style={{
        overflowY: "auto",
        height: '100vh'
      }}>
        <Header />
        <Body />
      </div>
    </section >
  );
}
