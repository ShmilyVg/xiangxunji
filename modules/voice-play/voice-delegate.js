import {getVoiceManager} from "./xxj-voice-manager";
import {getDefaultMindId} from "../../pages/index/data-manager";

class VoiceDelegate {
    constructor() {
        this._latestMindVoiceId = getDefaultMindId;
    }

    setOnTimeUpdateListener({listener}) {
        getVoiceManager.setOnTimeUpdateListener(arguments[0]);
    }

    async play({mindVoiceId, noiseVoiceId}) {
        if (this._latestMindVoiceId !== mindVoiceId) {
            await getVoiceManager.play(arguments[0]);
            this._latestMindVoiceId = mindVoiceId;
        } else {
            //
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
