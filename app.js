//app.js
import Login from "./modules/network/network/libs/login";
import HiXujBluetoothManager from "./modules/bluetooth/hi-xxj-bluetooth-manager";
import {ConnectState} from "./modules/bluetooth/bluetooth-state";

App({
    async onLaunch() {
        this.globalData.systemInfo = wx.getSystemInfoSync();
        this.globalData.navHeight = this.globalData.systemInfo.statusBarHeight + 46;
        this.bLEManager = new HiXujBluetoothManager();
        this.bLEManager.setBLEListener({
            onConnectStateChanged: async (res) => {
                const {connectState} = res;
                console.log('app.js 蓝牙连接状态更新', res);
                switch (connectState) {
                    case ConnectState.CONNECTED:
                        setTimeout(async () => {
                            await this.bLEManager.getProtocol().setLocalTime();
                        }, 1000);
                        break;
                    default:

                        break;
                }
                this.onAppBLEConnectStateChangedListener && this.onAppBLEConnectStateChangedListener({connectState});

            },

            onReceiveData: res => {
                const {protocolState, value} = res;
                console.log('app.js 蓝牙协议接收到新的', res);
            }
        });
        await Login.doLogin();
        this.bLEManager.connect();
    },

    getBLEManager() {
        return this.bLEManager;
    },

    onShow() {
        this.isAppOnShow = true;
    },

    onHide() {
        this.isAppOnShow = false;
    },
    onAppBLEConnectStateChangedListener: null,
    globalData: {
        userInfo: null
    }
});
