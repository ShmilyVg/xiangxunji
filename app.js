//app.js
App({
    onLaunch() {
        this.globalData.systemInfo = wx.getSystemInfoSync();
        this.globalData.navHeight = this.globalData.systemInfo.statusBarHeight + 46;
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })

    },

    getBackgroundAudioManager() {
        return wx.getBackgroundAudioManager();
    },

    globalData: {
        userInfo: null
    }
});
