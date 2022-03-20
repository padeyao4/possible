import React from "react";
import { FunctionComponent } from "react";
import styles from './index.css'

interface TimeHeaderCellProps {
    date: number
    /**
     * 单元格宽度，单位px
     */
    cellWidth: number
}

const TimeHeaderCell: FunctionComponent<TimeHeaderCellProps> = (props) => {
    return (<div className={styles.base} style={{
        width: props.cellWidth
    }}>
        {props.date}
    </div>);
}

export default TimeHeaderCell;