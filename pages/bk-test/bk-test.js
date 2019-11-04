// pages/bk-test/bk-test.js
import {ConnectState} from "../../modules/bluetooth/bluetooth-state";

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        version: '0.0.1'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    send0x56() {
        const bleManager = app.getBLEManager();
        if (bleManager.getBLELatestConnectState() === ConnectState.CONNECTED) {
            bleManager.getProtocol().getDeviceAllStatus();
        }
    }
});
