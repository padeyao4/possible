import Cell from '@/components/Cell';
import React, { useEffect, useState } from 'react';
import { Model } from '../models/model';


export default function () {

  const [data, setData] = useState(new Model())

  const [width, setWidth] = useState(window.innerWidth / data.width - 50)

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      setWidth(() => {
        return window.innerWidth / data.width - 50
      })
    })
  })

  return (
    <div >
      {
        [...new Array(data.height).keys()].map((v1) => {
          return <div>
            {
              [...new Array(data.width).keys()].map(v2 => {
                return <Cell key={v2 + "-" + v1} width={width}>{v2 + "-" + v1}</Cell>
              })
            }
          </div>
        })
      }
    </div>
  );
}
