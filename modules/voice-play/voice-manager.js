import {getDefaultWhiteNoiseId, getMindPractiseList, getWhiteNoiseList} from "../../pages/index/data-manager";
import Protocol from "../network/protocol";
import {Toast} from "heheda-common-view";

class VoiceManager {
    constructor() {
        this.backgroundAudioManager = wx.getBackgroundAudioManager();

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


    play({mindVoiceId = 0, noiseVoiceId = getDefaultWhiteNoiseId}) {
        return new Promise(async (resolve, reject) => {
            const bgAManager = this.backgroundAudioManager;
            if (!mindVoiceId && noiseVoiceId === getDefaultWhiteNoiseId) {
                reject({errCode: 1000, errMsg: '未设置任何音频Id，请至少填写一个'});
            }
            const voiceTitle = [getMindPractiseList().find(item => item.id === mindVoiceId), getWhiteNoiseList().find(item => item.id === noiseVoiceId)]
                .filter(item => !!item).map(item => item.title).join('-');
            Toast.showLoading();
            const {result: {url: voiceIdBackStr}} = await Protocol.getVoiceUrl({mindVoiceId, noiseVoiceId});
            Toast.hiddenLoading();
            this.backgroundAudioSrc = voiceIdBackStr;
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
