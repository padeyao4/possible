import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "./index.css"


interface NodeProps {
}

const Node: FunctionComponent<NodeProps> = (props) => {
    return (
        <div className={styles.bg} style={{
            height: '40px'
        }}
        >
            {props.children}
        </div>
    );
}

export default Node;