const App = getApp();

//自定义的NavigationBar
Component({
    options: {
        addGlobalClass: false,
    },
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: ''
        },
        showNav: {
            type: Boolean,
            value: true
        },
        showBack: {
            type: Boolean,
            value: true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},
    lifetimes: {
        attached: function () {
            const currentPages = getCurrentPages();
            this.setData({
                navH: App.globalData.navHeight,
                showBack: currentPages.length > 1
            });
        },

    },
    /**
     * 组件的方法列表
     */
    methods: {
        //回退
        navBack() {
            wx.navigateBack({
                delta: 1
            });
        },
    }
})
