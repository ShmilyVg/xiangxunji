const App = getApp();

//自定义的NavigationBar
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {show: false},
    lifetimes: {
        attached() {

        },

    },
    pageLifetimes: {
        show() {
            if (!this.data.show) {
                setTimeout(() => {
                    this.setData({show: true});
                }, 1000);
            }
        },
        hide() {
            if (this.data.show) {
                this.setData({show: false});
            }
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {}
});
