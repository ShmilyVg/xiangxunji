import HiNavigator from "../../navigator/hi-navigator";
import Storage from "../../utils/storage";

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
    data: {show: false, isLightOpen: false, isWaterOpen: false},
    lifetimes: {
        async attached() {
            const lightOpen = Storage.getLightOpen();
            const waterOpen = Storage.getWaterOpen();
            this.setData({
                isWaterOpen: !!(await waterOpen),
                isLightOpen: !!(await lightOpen),
            })
        },

    },
    /**
     * 组件的方法列表
     */
    methods: {
        _clickOpenSwitch(e) {
            const {detail: {tag: type, open}} = e;
            if (type === 'light') {
                this.setData({isLightOpen: open}, async () => {
                    await Storage.setLightOpen({open});
                });
            } else if (type === 'water') {
                this.setData({isWaterOpen: open}, async () => {
                    await Storage.setWaterOpen({open});
                });
            }
        },
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
