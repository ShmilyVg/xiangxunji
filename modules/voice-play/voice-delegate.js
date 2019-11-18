import {getVoiceManager} from "./voice-manager";

export default class VoiceDelegate {
    constructor() {

    }

    onTimeUpdate({callback}) {
        getVoiceManager.onTimeUpdate({callback});
    }

    play({mindVoiceId, noiseVoiceId}) {
        getVoiceManager.play(arguments[0]);
    }

    playCurrentVoice() {
        getVoiceManager.playCurrentVoice();
    }

    pause() {
        getVoiceManager.pause();
    }

};


export const AppVoiceDelegate = new VoiceDelegate();
