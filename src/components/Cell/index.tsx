import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "./index.css"


interface CellProps {
    width:number
}

const Cell: FunctionComponent<CellProps> = (props) => {

    return (
        <div className={styles.bg} style={{
            width: props.width,
            height: '40px'
        }}>
            {props.children}
        </div>
    );
}

export default Cell;