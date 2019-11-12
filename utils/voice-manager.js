import {getMindPractiseList, getWhiteNoiseList} from "../pages/index/data-manager";
import {VoiceUrl} from "./config";

class VoiceManager {
    constructor() {
        this.backgroundAudioManager = app.getBackgroundAudioManager();

        this.backgroundAudioManager.onError(err => {
            console.error('backgroundAudioManager 报错', err);
        });
        this.backgroundAudioManager.onEnded(res => {
            console.log('backgroundAudioManager播放结束', res);
            this.backgroundAudioManager.src = this.backgroundAudioSrc;
            this.backgroundAudioManager.play();
        });

        // this.audioContext = wx.createInnerAudioContext();
        // wx.setInnerAudioOption({mixWithOther: true});
        // this.audioContext.onError(err => {
        //     console.error('audioContext 报错', err);
        // });
        // this.audioContext.onEnded(res => {
        //     console.log('audioContext播放结束', res);
        //     // this.audioContext.src = this.personAudio;
        //     // this.audioContext.play();
        // });
    }

    onTimeUpdate({callback}) {
        this.backgroundAudioManager.onTimeUpdate(callback);
    }

    play({mindVoiceId = 0, noiseVoiceId = 0}) {
        return new Promise((resolve, reject) => {
            const bgAManager = this.backgroundAudioManager;
            if (!mindVoiceId && !noiseVoiceId) {
                reject({errCode: 1000, errMsg: '未设置任何音频Id，请至少填写一个'});
            }
            const targetVoiceList = [getMindPractiseList().find(item => item.id === mindVoiceId), getWhiteNoiseList().find(item => item.id === noiseVoiceId)].filter(item => !!item);
            const voiceTitle = targetVoiceList.map(item => item.title).join('-');
            const voiceIdBackStr = targetVoiceList.map(item => item.title).join('-');
            this.backgroundAudioSrc = VoiceUrl + voiceIdBackStr;
            bgAManager.src = this.backgroundAudioSrc;
            bgAManager.title = voiceTitle;
            bgAManager.play();
            resolve({src: this.backgroundAudioSrc, title: voiceTitle});
        });
    }

    playCurrentVoice() {
        const bgAManager = this.backgroundAudioManager;
        if (bgAManager.pause) {
            bgAManager.play();
        }
    }

    pause() {
        const bgAManager = this.backgroundAudioManager;
        if (!bgAManager.pause) {
            bgAManager.pause();
        }
    }
}

export const getVoiceManager = new VoiceManager();
