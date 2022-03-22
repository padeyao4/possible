import { Button, Popover } from "antd";
import React, { FunctionComponent } from "react";
import Edit from "./Edit";


interface NodeProps {
    id: number
}

const Node: FunctionComponent<NodeProps> = (props) => {
    return (
        <Popover
            content={<Edit id={props.id}></Edit>}
            autoAdjustOverflow
            destroyTooltipOnHide={true}
            placement="right"
            trigger="click">
                {/* todo button改掉 */}
            <Button>
                {/* todo 做具体内容 */}
            </Button>
        </Popover>
    );
}

export default Node;