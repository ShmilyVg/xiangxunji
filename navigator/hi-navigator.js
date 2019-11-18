import CommonNavigator from "heheda-navigator";

export default class HiNavigator extends CommonNavigator {
    static navigateToPlayPage({mindVoiceId, noiseVoiceId}) {
        this.navigateTo({url: '/pages/play/play?mindVoiceId=' + mindVoiceId + '&noiseVoiceId=' + noiseVoiceId});
    }

    static navigateToMoreSetting() {
        this.navigateTo({url: '/pages/setting/setting'});
    }

    static navigateToUserCenter() {
        this.navigateTo({url: '/pages/user-center/user-center'});
    }

    static navigateToConnectDevice() {
        this.navigateTo({url: '/pages/connect-device/connect-device'});
    }

    static navigateToFeedbackPage() {
        this.navigateTo({url: '/pages/feedback/feedback'});
    }
}
