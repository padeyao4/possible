import Edge from '@/components/Edge';
import React, { useState } from 'react';
import { Model } from '../models/model';
import Node from '@/components/Node'


export default function () {

  const [model, setModel] = useState(new Model())

  const Header = () => (<div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${model.cols}, 1fr)`
  }}>
    {
      [...new Array(model.cols).keys()].map((v) => {
        return <div key={v}>
          {v}
        </div>
      })
    }
  </div >)

  const Body = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${model.cols}, 1fr)`,
      overflowY: "auto"
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
    <div >
      <Header />
      <Edge></Edge>
      <Body />
    </div>
  );
}
