import {NetworkConfig} from "../modules/network/network/index";

const Release = false,
    SoftwareVersion = `${Release ? '' : '香薰机_Stage '}v0.1.0`,
    PostUrl = `http://backend.${Release ? '' : 'stage.'}hipee.cn/hipee-web-aroma/`,
    UploadUrl = 'https://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do',
    VoiceUrl = 'http://img.hipee.cn/aroma/',
    DIALOG_BG_ANIMATION_DURATION = 400;

NetworkConfig.setConfig({postUrl: PostUrl});
export {
    PostUrl,
    UploadUrl,
    VoiceUrl,
    SoftwareVersion,
    Release,
    DIALOG_BG_ANIMATION_DURATION
};
