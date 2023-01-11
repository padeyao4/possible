import { Graph } from "@antv/x6";
import { useEffect, useRef } from "react";

export default function Flow() {
    const ref = useRef(null)
    let graph = null

    useEffect(() => {
        graph = new Graph({
            container: ref.current!,
            autoResize: true,
            height: 100,
            background: {
                color: '#eee'
            }
        })
    }, [])

    return (
        <div ref={ref}>
        </div>
    );
}