import CommonNavigator from "heheda-navigator";

export default class HiNavigator extends CommonNavigator {
    static navigateToPlayPage({id}) {
        this.navigateTo({url: '/pages/play/play?id=' + id});
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
