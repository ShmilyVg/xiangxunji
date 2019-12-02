import {getVoiceManager} from "./xxj-voice-manager";
import {getDefaultMindId} from "../../pages/index/data-manager";

class VoiceDelegate {
    constructor() {
        this._latestMindVoiceId = getDefaultMindId;
        this._latestNoiseVoiceId = 0;
    }

    getLatestNoiseVoiceId() {
        return this._latestNoiseVoiceId;
    }

    getLatestMindVoiceId() {
        return this._latestMindVoiceId;
    }

    setOnTimeUpdateListener({listener}) {
        getVoiceManager.setOnTimeUpdateListener(arguments[0]);
    }

    setOnPauseListener({listener}) {
        getVoiceManager.setOnPauseListener(arguments[0]);
    }


    setOnPlayListener({listener}) {
        getVoiceManager.setOnPlayListener(arguments[0]);
    }

    // removeOnPlayListener({context}) {
    //     getVoiceManager.removeOnPlayListener(arguments[0]);
    // }

    getAllVoiceId({options}) {
        const mindVoiceId = parseInt(options.mindVoiceId) || getDefaultMindId,
            latestNoiseVoiceId = AppVoiceDelegate.getLatestNoiseVoiceId(),
            latestMindVoiceId = AppVoiceDelegate.getLatestMindVoiceId();
        let noiseVoiceId = latestNoiseVoiceId;
        if (mindVoiceId && latestMindVoiceId === mindVoiceId) {
            noiseVoiceId = latestNoiseVoiceId || parseInt(options.noiseVoiceId);//播放同一个人声音频，优先读取上一次的白噪音
        } else {
            noiseVoiceId = parseInt(options.noiseVoiceId) || latestNoiseVoiceId;//播放不同的人声音频/只播放白噪音，优先读取传入的白噪音
        }
        return {mindVoiceId, noiseVoiceId};
    }

    async play({mindVoiceId, noiseVoiceId}) {
        console.log(this._latestMindVoiceId, mindVoiceId, this._latestNoiseVoiceId, noiseVoiceId);
        if (this._latestMindVoiceId !== mindVoiceId || this._latestNoiseVoiceId !== noiseVoiceId) {
            await getVoiceManager.play(arguments[0]);
            this._latestMindVoiceId = mindVoiceId;
            this._latestNoiseVoiceId = noiseVoiceId;
            return {replay: true};
        } else {
            const {backgroundAudioManager} = getVoiceManager;
            if (backgroundAudioManager.paused) {//如果进入的是同一个人声音频，并且音频已经暂停或是播放完成，则保持该状态
                const currentTime = getVoiceManager.getCurrentTime(),
                    duration = getVoiceManager.getDuration();
                getVoiceManager._onTimeUpdateListener({currentTime, duration});
            } else {
                getVoiceManager._onPlayListener();
            }
        }
        return {replay: false};
    }


    playCurrentVoice() {
        getVoiceManager.playCurrentVoice();
    }

    pause() {
        getVoiceManager.pause();
    }

}


export const AppVoiceDelegate = new VoiceDelegate();
