// pages/user-center/user-center.js
import HiNavigator from "../../navigator/hi-navigator";
import {SoftwareVersion} from "../../utils/config";

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        SoftwareVersion,
        connectState: ''
    },

    reconnectEvent() {
        app.getBLEManager().connect();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        app.getBLEManager().setBLEListener({
            onConnectStateChanged: ({connectState}) => {
                this._updateConnectState({connectState});
            }
        });
    },
    toMyDeviceSettingPage() {
        HiNavigator.navigateToDeviceSetting();
    },
    toFeedbackPage() {
        HiNavigator.navigateToFeedbackPage();
    },

    updateConnectStateView({connectState}) {
        this.setData({connectState});
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.updateConnectStateView({connectState: app.getBLEManager().getBLELatestConnectState()});
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

});
