import Edge from '@/components/Edge';
import Node from '@/components/Node';
import React, { useState } from 'react';
import { Model } from '../models/model';


export default function () {

  const [model, setModel] = useState(new Model())

  const Header = () => (<div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${model.width}, 1fr)`
  }}>
    {
      [...new Array(model.width).keys()].map((v) => {
        return <div key={v}>
          {v}
        </div>
      })
    }
  </div >)

  const Body = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${model.width}, 1fr)`
    }}>
      {
        [...new Array(model.height).keys()].map((v1) => {
          return [...new Array(model.width).keys()].map(v2 => {
            return <Node key={v2 + "-" + v1}>{v2 + "-" + v1}</Node>
          })
        })
      }
    </div>
  )


  return (
    <div >
      <Header></Header>
      <Edge></Edge>
      <Body/>
    </div>
  );
}
