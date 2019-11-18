import Network from "./network/libs/network";

export default class Protocol {

    static getAccountInfo() {
        return Network.request({url: 'account/info'});
    }

    static getVoiceUrl({mindVoiceId: mindPractiseId, noiseVoiceId: whiteNoiseId}) {
        return Network.request({url: 'voice/get', data: {mindPractiseId, whiteNoiseId}, requestWithoutLogin: true});
    }

}


