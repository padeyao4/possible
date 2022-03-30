import { Model } from "@/models/model";
import React, { CSSProperties, FunctionComponent } from "react";
import styles from './index.less'

interface HeaderProps {
    model: Model
}

const Header: FunctionComponent<HeaderProps> = (props) => {
    const model = props.model

    const cssStyle: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${model.cols}, 1fr)`,
        backgroundColor: "skyblue"
    }

    const handleMoveLeft = () => {
        model.cursor -= 1
    }

    const handleMoveRight = () => {
    }

    return (
        <div className={styles.header}>
            <div>
                <button onClick={handleMoveLeft}>left</button>
                <button onClick={handleMoveRight}>right</button>
                <div>{model.projectIndex != null ? model.projects[model.projectIndex].goal : ""}</div>
            </div>
            <div style={cssStyle}>
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