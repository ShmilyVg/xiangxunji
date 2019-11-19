import {getVoiceManager} from "./xxj-voice-manager";
import {getDefaultMindId, getDefaultWhiteNoiseId} from "../../pages/index/data-manager";

class VoiceDelegate {
    constructor() {
        this._latestMindVoiceId = getDefaultMindId;
        this._latestNoiseVoiceId = getDefaultWhiteNoiseId;
    }

    setOnTimeUpdateListener({listener}) {
        getVoiceManager.setOnTimeUpdateListener(arguments[0]);
    }

    setOnPauseListener({listener}) {
        getVoiceManager.setOnPauseListener(arguments[0]);
    }


    setOnPlayListener({listener, context}) {
        getVoiceManager.setOnPlayListener(arguments[0]);
    }

    removeOnPlayListener({context}) {
        getVoiceManager.removeOnPlayListener(arguments[0]);
    }

    async play({mindVoiceId, noiseVoiceId}) {
        console.log(this._latestMindVoiceId, mindVoiceId, this._latestNoiseVoiceId, noiseVoiceId);
        if (this._latestMindVoiceId !== mindVoiceId || this._latestNoiseVoiceId !== noiseVoiceId) {
            await getVoiceManager.play(arguments[0]);
            this._latestMindVoiceId = mindVoiceId;
            this._latestNoiseVoiceId = noiseVoiceId;
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
    }


    playCurrentVoice() {
        getVoiceManager.playCurrentVoice();
    }

    pause() {
        getVoiceManager.pause();
    }

}


export const AppVoiceDelegate = new VoiceDelegate();
