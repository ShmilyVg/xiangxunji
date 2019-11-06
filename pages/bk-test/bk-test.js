// pages/bk-test/bk-test.js
import {ConnectState} from "../../modules/bluetooth/bluetooth-state";

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        version: '0.0.5'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    onSubmitEvent(e) {
        const {detail: {value: {sendDataValue}}} = e;
        const array = sendDataValue.split(',').filter(item => !!item).map(item => parseInt(item));
        console.log('输入的内容', array);
        const bleManager = app.getBLEManager();
        if (bleManager.getBLELatestConnectState() === ConnectState.CONNECTED) {
            bleManager.getProtocol().sendDataWithInput({array});
        }


    },
    send0x56() {
        const bleManager = app.getBLEManager();
        if (bleManager.getBLELatestConnectState() === ConnectState.CONNECTED) {
            bleManager.getProtocol().getDeviceAllStatus();
        }
    }
});
