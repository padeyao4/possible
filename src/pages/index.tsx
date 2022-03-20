import Node from '@/components/Node';
import React, { useEffect, useState } from 'react';
import { Model } from '../models/model';
import Constant from '@/constants/constant';
import TimeHeader from '@/components/TimeHeader';
import Edge from '@/components/Edge';


export default function () {

  const [model, setModel] = useState(new Model())

  const [width, setWidth] = useState(window.innerWidth / model.width - Constant.OFFSET)

  useEffect(() => {
    const handleResize = () => {
      setWidth(() => {
        return window.innerWidth / model.width - Constant.OFFSET
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [window.innerWidth])

  return (
    <div >
      <TimeHeader model={model} width={width}></TimeHeader>
      {
        [...new Array(model.height).keys()].map((v1) => {
          return <div key={v1}>
            {
              [...new Array(model.width).keys()].map(v2 => {
                return <Node key={v2 + "-" + v1} width={width}>{v2 + "-" + v1}</Node>
              })
            }
          </div>
        })
      }
      <Edge></Edge>
    </div>
  );
}
