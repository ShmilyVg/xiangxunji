// pages/user-center/user-center.js
import {ConnectState} from "../../modules/bluetooth/bluetooth-state";
import HiNavigator from "../../navigator/hi-navigator";

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        connectState: ''
    },

    reconnectEvent() {
        const connectState = app.getBLEManager().getBLELatestConnectState();
        if (connectState === ConnectState.CONNECTING || connectState === ConnectState.CONNECTED) {
            return;
        }
        app.getBLEManager().connect();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            connectState: app.getBLEManager().getBLELatestConnectState()
        });
    },
    toFeedbackPage() {
        HiNavigator.navigateToFeedbackPage();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

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
