import HiNavigator from "../../navigator/hi-navigator";
import Storage from "../../utils/storage";
import {DIALOG_BG_ANIMATION_DURATION} from "../../utils/config";

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
    data: {show: false, isLightOpen: false, isWaterOpen: false, showJoinAnimation: false},
    lifetimes: {
        async attached() {

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
        async _showFun() {
            const lightOpen = Storage.getLightOpen();
            const waterOpen = Storage.getWaterOpen();
            this.setData({
                isWaterOpen: !!(await waterOpen),
                isLightOpen: !!(await lightOpen),
                show: true
            }, () => {
                this.setData({
                    showJoinAnimation: true
                })
            });
        },
        _hideFun() {
            this.setData({
                showJoinAnimation: false
            }, () => {
                setTimeout(() => {
                    this.setData({show: false});
                }, DIALOG_BG_ANIMATION_DURATION);
            });
        },
        _doNothing() {

        }
    }
});
