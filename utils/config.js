import {NetworkConfig} from "../modules/network/network/index";

const Release = false;

const SoftwareVersion = `${Release ? '' : '香薰机_Stage '}v0.1.0`;

const PostUrl = `https://backend.${Release ? '' : 'stage.'}hipee.cn/hipee-web-aroma/`;
const UploadUrl = 'https://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do';
const VoiceUrl = 'http://img.hipee.cn/aroma/';
NetworkConfig.setConfig({postUrl: PostUrl});

export {
    PostUrl,
    UploadUrl,
    VoiceUrl,
    SoftwareVersion,
    Release
};
