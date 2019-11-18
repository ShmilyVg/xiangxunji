import {getVoiceManager} from "./xxj-voice-manager";
import {getDefaultMindId} from "../../pages/index/data-manager";

export default class VoiceDelegate {
    constructor() {
        this._latestMindVoiceId = getDefaultMindId;
    }

    onTimeUpdate({callback}) {
        getVoiceManager.onTimeUpdate({callback});
    }

    play({mindVoiceId, noiseVoiceId}) {
        if (this._latestMindVoiceId !== mindVoiceId) {
            getVoiceManager.play(arguments[0]);
            this._latestMindVoiceId = mindVoiceId;
        }
    }

    playCurrentVoice() {
        getVoiceManager.playCurrentVoice();
    }

    pause() {
        getVoiceManager.pause();
    }

};


export const AppVoiceDelegate = new VoiceDelegate();
