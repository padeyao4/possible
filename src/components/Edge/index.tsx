import React, { FunctionComponent } from "react";

interface EdgeProps {
}

const Edge: FunctionComponent<EdgeProps> = (props) => {
    return (<svg
        // width={300}
        // height={200}
        style={{
            // backgroundColor: "red",
            position: "absolute",
            zIndex: 99,
            opacity: 0.2,
            pointerEvents:"none"
        }}
    >
        <circle
            cx={100}
            cy={50}
            r={40}
            stroke="black"
            strokeWidth={2}
            fill="yellow"
            style={{
                pointerEvents:"auto"
            }}
        />
    </svg>);
}

export default Edge;