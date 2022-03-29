import { Model } from "@/models/model";
import React, { FunctionComponent } from "react";

interface HeaderProps {
    model: Model
}

const Header: FunctionComponent<HeaderProps> = (props) => {
    const model = props.model
    return (
        <div style={{
            position: "sticky",
            top: 0,
            zIndex: 99
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${model.cols}, 1fr)`,
                backgroundColor: "skyblue"
            }}>
                {
                    [...new Array(model.cols).keys()].map((v) => {
                        return <div key={v}>
                            {v}
                        </div>
                    })
                }
            </div >
        </div>
    );
}

export default Header;