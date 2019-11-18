import {getVoiceManager} from "./xxj-voice-manager";
import {getDefaultMindId} from "../../pages/index/data-manager";

class VoiceDelegate {
    constructor() {
        this._latestMindVoiceId = getDefaultMindId;
    }

    setOnTimeUpdateListener({listener}) {
        getVoiceManager.setOnTimeUpdateListener(arguments[0]);
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
        } else if (getVoiceManager.backgroundAudioManager.paused) {
            getVoiceManager.playCurrentVoice();
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
