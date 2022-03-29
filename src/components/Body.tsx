import { Model } from "@/models/model";
import React from "react";
import { FunctionComponent } from "react";
import Node from './Node'

interface BodyProps {
    model: Model
}

const Body: FunctionComponent<BodyProps> = (props) => {
    const model = props.model;

    return (<div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${model.cols}, 1fr)`
    }}>
        {
            [...new Array(model.rows).keys()].map((v1) => {
                return [...new Array(model.cols).keys()].map(v2 => {
                    return <Node key={v2 + "-" + v1} id={v1 * v2}>{v2 + "-" + v1}</Node>;
                })
            })
        }
    </div>);
}

export default Body;