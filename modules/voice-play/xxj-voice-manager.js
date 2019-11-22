import {getDefaultMindId, getMindPractiseList, getWhiteNoiseList} from "../../pages/index/data-manager";
import Protocol from "../network/protocol";
import BaseVoiceManager from "./base-voice-manager";

class XXJVoiceManager extends BaseVoiceManager {

    play({mindVoiceId = getDefaultMindId, noiseVoiceId}) {
        return new Promise(async (resolve, reject) => {
            if (!mindVoiceId && !noiseVoiceId) {
                reject({errCode: 1000, errMsg: '未设置任何音频Id，请至少填写一个'});
            }
            const title = [getMindPractiseList().find(item => item.id === mindVoiceId), getWhiteNoiseList().find(item => item.id === noiseVoiceId)]
                .filter(item => !!item).map(item => item.title).join('-');
            const {result: {url: src}} = await Protocol.getVoiceUrl({mindVoiceId, noiseVoiceId});
            await super.play({src, title});
            resolve();
        });
    }
}

export const getVoiceManager = new XXJVoiceManager();
