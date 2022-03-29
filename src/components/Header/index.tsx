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

    return (
        <div className={styles.header}>
            <div>
                <button>left</button><button>right</button><div>{model.projectIndex ? model.projects[model.projectIndex] : ""}</div>
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