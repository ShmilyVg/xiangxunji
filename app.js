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
            listener: (res) => {
                const {connectState, protocolState, value} = res;
                console.log('触发蓝牙事件', res);
            },
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
