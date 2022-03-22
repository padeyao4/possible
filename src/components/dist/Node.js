"use strict";
exports.__esModule = true;
var antd_1 = require("antd");
var react_1 = require("react");
var Node = function (props) {
    return (react_1["default"].createElement(antd_1.Popover, { content: props.children, autoAdjustOverflow: true, destroyTooltipOnHide: true, placement: "right", trigger: "click" },
        react_1["default"].createElement(antd_1.Button, null)));
};
exports["default"] = Node;
