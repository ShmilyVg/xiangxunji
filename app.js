//app.js
import Login from "./modules/network/network/libs/login";
import HiSmellBlueToothManager from "./modules/bluetooth/hi-smell-bluetooth-manager";

App({
    async onLaunch() {
        this.globalData.systemInfo = wx.getSystemInfoSync();
        this.globalData.navHeight = this.globalData.systemInfo.statusBarHeight + 46;
        this.bLEManager = new HiSmellBlueToothManager();
        this.bLEManager.init();
        this.bLEManager.setBLEListener({
            onConnectStateChanged: (res) => {
                const {connectState} = res;
                console.log('app.js 蓝牙连接状态更新', res);
            },

            onReceiveData: res => {
                const {protocolState, value} = res;
                console.log('app.js 蓝牙协议接收到新的', res);
            }
        });
        await Login.doLogin();
        this.bLEManager.connect();
    },

    getBackgroundAudioManager() {
        return wx.getBackgroundAudioManager();
    },

    globalData: {
        userInfo: null
    }
});
