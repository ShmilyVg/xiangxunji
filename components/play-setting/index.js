import HiNavigator from "../navigator/hi-navigator";

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
    /**
     * 组件的方法列表
     */
    methods: {
        _toMoreSettingPage() {
            HiNavigator.navigateToMoreSetting();
            this._hideFun();
        },
        _showFun() {
            this.setData({show: true});
        },
        _hideFun() {
            this.setData({show: false});
        },
        _doNothing() {

        }
    }
});
