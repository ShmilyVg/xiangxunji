// pages/bk-test/bk-test.js
import {ConnectState} from "../../modules/bluetooth/bluetooth-state";
import {Toast} from "heheda-common-view";

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        version: '0.1.2'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    onSubmitEvent(e) {
        const {detail: {value: {sendDataValue}}} = e;
        const array = sendDataValue.split(',').filter(item => !!item).map(item => parseInt(item, 16));
        console.log('输入的内容，转换为10进制', array);
        if (array.length === 7) {
            const bleManager = app.getBLEManager();
            if (bleManager.getBLELatestConnectState() === ConnectState.CONNECTED) {
                bleManager.getProtocol().sendDataWithInput({array});
            }
        } else {
            Toast.showText('输入的数据不足7位！');
        }


    },
    send0x56() {
        const bleManager = app.getBLEManager();
        if (bleManager.getBLELatestConnectState() === ConnectState.CONNECTED) {
            bleManager.getProtocol().getDeviceAllStatus();
        }
    }
});
