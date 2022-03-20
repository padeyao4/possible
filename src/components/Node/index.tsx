import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "./index.css"


interface NodeProps {
    width:number
}

const Node: FunctionComponent<NodeProps> = (props) => {

    const handleMouseOver=()=>{
        
    }

    return (
        <div className={styles.bg} style={{
            width: props.width,
            height: '40px'
        }}
        onMouseOver={handleMouseOver}
        >
            {props.children}
        </div>
    );
}

export default Node;