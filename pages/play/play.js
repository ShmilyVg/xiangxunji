// pages/play/play.js
import {getMindPractiseList, getWhiteNoiseList} from "../index/data-manager";
import {AppVoiceDelegate} from "../../modules/voice-play/voice-delegate";

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
        const mindVoiceId = parseInt(options.mindVoiceId) || undefined;
        const noiseVoiceId = parseInt(options.noiseVoiceId) || undefined;
        const mindVoiceItem = mindVoiceId && getMindPractiseList().find(item => item.id === mindVoiceId);
        const noiseVoiceItem = noiseVoiceId && getWhiteNoiseList().find(item => item.id === noiseVoiceId);
        if (mindVoiceItem || noiseVoiceItem) {
            const whiteNoiseList = getWhiteNoiseList();

            this.setData({
                targetVoice: mindVoiceItem || noiseVoiceItem,
                envVoices: !!mindVoiceItem ? whiteNoiseList : []
            }, () => {
                AppVoiceDelegate.play({mindVoiceId, noiseVoiceId});

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
