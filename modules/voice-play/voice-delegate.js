import {getVoiceManager} from "./xxj-voice-manager";
import {getDefaultMindId} from "../../pages/index/data-manager";

class VoiceDelegate {
    constructor() {
        this._latestMindVoiceId = getDefaultMindId;
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
        if (this._latestMindVoiceId !== mindVoiceId) {
            await getVoiceManager.play(arguments[0]);
            this._latestMindVoiceId = mindVoiceId;
        } else {
            const {backgroundAudioManager} = getVoiceManager;
            if (backgroundAudioManager.paused) {//如果进入的是同一个人声音频，并且音频已经暂停或是播放完成
                getVoiceManager._onTimeUpdateListener({
                    currentTime: getVoiceManager.getCurrentTime(),
                    duration: getVoiceManager.getDuration()
                });
                getVoiceManager.playCurrentVoice();
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
