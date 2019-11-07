// pages/play/play.js
import {getAllVoiceList, getWhiteNoiseList} from "../index/data-manager";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        startAnimation: false,
        targetVoice: {},
        envVoices: []
    },
    onChooseEnvVoiceItem(e) {
        console.log(e);
        const {detail: {item}} = e;
    },
    onLoad(options) {
        const voiceId = parseInt(options.id);
        const targetVoice = getAllVoiceList().find(item => item.id === voiceId);
        if (targetVoice) {
            const whiteNoiseList = getWhiteNoiseList();

            this.setData({
                targetVoice,
                envVoices: !whiteNoiseList.find(item => item.id === voiceId) ? whiteNoiseList : []
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        setTimeout(() => {
            this.setData({startAnimation: true}, 1000);
        })
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
});
