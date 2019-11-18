// pages/play/play.js
import {getMindPractiseList, getWhiteNoiseList} from "../index/data-manager";
import {AppVoiceDelegate} from "../../modules/voice-play/voice-delegate";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        delayTime: '',
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

            this.setData({
                targetVoice: mindVoiceItem || noiseVoiceItem,
                envVoices: !!mindVoiceItem ? getWhiteNoiseList() : []
            }, async () => {
                await AppVoiceDelegate.play({mindVoiceId, noiseVoiceId});
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        AppVoiceDelegate.setOnTimeUpdateListener({
            listener: ({currentTime, duration}) => {
                const delaySecond = (duration - currentTime);
                this.setData({
                    delayTime: ['0' + Math.floor(delaySecond / 60), '0' + Math.floor(delaySecond % 60)].map(item => item.slice(-2)).join(':')
                });
            }
        });
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
