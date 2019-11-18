import {
    getDefaultMindId,
    getDefaultWhiteNoiseId,
    getMindPractiseList,
    getWhiteNoiseList
} from "../../pages/index/data-manager";
import {Toast} from "heheda-common-view";
import Protocol from "../network/protocol";
import BaseVoiceManager from "./base-voice-manager";

class XXJVoiceManager extends BaseVoiceManager {

    play({mindVoiceId = getDefaultMindId, noiseVoiceId = getDefaultWhiteNoiseId}) {
        return new Promise(async (resolve, reject) => {
            if (!mindVoiceId && noiseVoiceId === getDefaultWhiteNoiseId) {
                reject({errCode: 1000, errMsg: '未设置任何音频Id，请至少填写一个'});
            }
            const title = [getMindPractiseList().find(item => item.id === mindVoiceId), getWhiteNoiseList().find(item => item.id === noiseVoiceId)]
                .filter(item => !!item).map(item => item.title).join('-');
            Toast.showLoading();
            const {result: {url: src}} = await Protocol.getVoiceUrl({mindVoiceId, noiseVoiceId});
            Toast.hiddenLoading();
            await super.play({src, title});
            resolve();
        });
    }
}

export const getVoiceManager = new XXJVoiceManager();
