import HiNavigator from "../../navigator/hi-navigator";
import {DIALOG_BG_ANIMATION_DURATION} from "../../utils/config";
import {Toast} from "heheda-common-view";

const App = getApp();

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
            // App.onAppBLEReceiveDataListener = ({protocolState, value}) => {
            //     switch (protocolState) {
            //         case XXJProtocolState.CONNECTED_AND_BIND:
            //
            //             break;
            //
            //     }
            // }
        },
        detached() {
            // App.onAppBLEReceiveDataListener = null;
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        async _clickOpenSwitch(e) {
            const {detail: {tag: type, open}} = e;
            Toast.showLoading();
            try {
                const bleProtocol = App.getBLEManager().getProtocol();
                if (type === 'light') {
                    await bleProtocol.setLightOpen({lightOpen: open});
                    this.setData({isLightOpen: open});
                } else if (type === 'water') {
                    await bleProtocol.setWater({openStatus: open ? 1 : 0,});
                    this.setData({isWaterOpen: open});
                }
            } catch (e) {
                console.error('在播放页面设置设备失败', e);
            } finally {
                Toast.hiddenLoading();
            }


        },
        _toMoreSettingPage() {
            HiNavigator.navigateToMoreSetting();
            this._hideFun();
        },
        async _showFun() {
            const bleManager = App.getBLEManager();
            try {
                await bleManager.judgeBLEIsConnected();
                const xxjConfig = await bleManager.getXXJConfig();
                console.log('xxjConfig', xxjConfig);
                const waterOpen = xxjConfig.water.openStatus;
                // const lightOpen = Storage.getWaterOpen();
                this.setData({
                    isLightOpen: true,
                    isWaterOpen: !!waterOpen,
                    show: true
                }, () => {
                    this.setData({
                        showJoinAnimation: true
                    })
                });
            } catch (e) {
                console.error(e);
            }
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
