import React, { FunctionComponent } from "react";

interface EdgeProps {
}

const Edge: FunctionComponent<EdgeProps> = (props) => {
    return (<svg 
        // width={300}
        // height={200}
        // style={{
        //     backgroundColor: "red"
        // }}
    >
        <circle 
        cx={100} 
        cy={50} 
        r={40} 
        stroke="black" 
        strokeWidth={2} 
        fill="yellow" />
    </svg>);
}

export default Edge;