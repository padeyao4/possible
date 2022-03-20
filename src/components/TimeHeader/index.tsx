import { Model } from "@/models/model";
import React, { FunctionComponent } from "react";
import TimeHeaderCell from "../TimeHeaderCell";

interface TimeHeaderProps {
    model: Model
    width: number
}

const TimeHeader: FunctionComponent<TimeHeaderProps> = (props) => {
    const { width, current, cursor } = props.model
    return (<div>
        {[...new Array(width).keys()].map(v1 => {
            return <TimeHeaderCell date={v1} key={v1} cellWidth={props.width}></TimeHeaderCell>;
        })}
    </div>);
}

export default TimeHeader;