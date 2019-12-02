// pages/play/play.js
import {getMindPractiseList, getWhiteNoiseList} from "../index/data-manager";
import {AppVoiceDelegate} from "../../modules/voice-play/voice-delegate";
import {config} from "../../components/play-action/play-state";
import {setDeviceWithDefaultSceneConfigById} from "../index/custom-config";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        delayTime: '',
        targetVoice: {},
        envVoices: []
    },
    async onChooseEnvVoiceItem(e) {
        const {detail: {selectedItemId}} = e;
        await AppVoiceDelegate.play({mindVoiceId: this.data.targetVoice.id, noiseVoiceId: selectedItemId});
    },
    onLoad(options) {
        // this.options = options;
        // const options = this.options;
        const {mindVoiceId, noiseVoiceId} = AppVoiceDelegate.getAllVoiceId({options});
        const mindVoiceItem = mindVoiceId && getMindPractiseList().find(item => item.id === mindVoiceId);
        const noiseVoiceItem = noiseVoiceId && getWhiteNoiseList().find(item => item.id === noiseVoiceId);
        if (mindVoiceItem || noiseVoiceItem) {
            this.setData({
                targetVoice: mindVoiceItem || noiseVoiceItem,
            }, async () => {
                this.setAppVoiceListener();
                const {replay} = await AppVoiceDelegate.play({mindVoiceId, noiseVoiceId});
                this.setData({
                    envVoices: !!mindVoiceItem ? getWhiteNoiseList() : []
                }, () => {
                    replay && setTimeout(async () => {
                        await setDeviceWithDefaultSceneConfigById({voiceId: mindVoiceId || noiseVoiceId});
                    }, 50);
                });
            });
        }
    },

    setAppVoiceListener() {
        AppVoiceDelegate.setOnTimeUpdateListener({
            listener: ({currentTime, duration}) => {
                const delaySecond = (duration - currentTime);
                this.setData({
                    delayTime: ['0' + Math.floor(delaySecond / 60), '0' + Math.floor(delaySecond % 60)].map(item => item.slice(-2)).join(':')
                });
            }
        });
        AppVoiceDelegate.setOnPlayListener({
            listener: () => {
                setTimeout(() => {
                    this.setData({
                        bgOpacity: 1
                    });
                }, 300);
                this.setData({playState: config.playing.state});
            }
        });
        AppVoiceDelegate.setOnPauseListener({
            listener: () => {
                this.setData({playState: config.pause.state});
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
