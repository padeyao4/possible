//去除谷歌浏览器的scroll、wheel等事件警告
(function () {
    if (typeof EventTarget !== "undefined") {
        let func = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, fn, capture) {
            //@ts-ignore
            this.func = func;
            if (typeof capture !== "boolean") {
                capture = capture || {};
                capture.passive = false;
            }
            //@ts-ignore
            this.func(type, fn, capture);
        };
    }
}())
