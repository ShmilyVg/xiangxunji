const page = Page;
Page = function () {

    const args = arguments[0], onShow = args.onShow, onHide = args.onHide;
    if (onShow) {
        console.warn('执行onShow注入',onShow);
        args.onShow = function () {
            return onShow.call(args, arguments[0]);
        };
    }

    return page.call(null, arguments[0]);
};
