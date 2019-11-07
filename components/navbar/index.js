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
        backgroundColor: {
            type: String,
            value: '#24213A'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {showBack: false, showCustomBack: false},
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
        navCustomBack() {
            this.triggerEvent('onBack');
        }
    }
})
