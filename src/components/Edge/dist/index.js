"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Edge = function (props) {
    return (react_1["default"].createElement("svg", { 
        // width={300}
        // height={200}
        style: {
            // backgroundColor: "red",
            position: "absolute",
            zIndex: 99,
            opacity: 0.2,
            pointerEvents: "none"
        } },
        react_1["default"].createElement("circle", { cx: 100, cy: 50, r: 40, stroke: "black", strokeWidth: 2, fill: "yellow", style: {
                pointerEvents: "auto"
            } })));
};
exports["default"] = Edge;
