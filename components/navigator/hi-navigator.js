import CommonNavigator from "heheda-navigator";

export default class HiNavigator extends CommonNavigator {
    static navigateToPlay() {
        this.navigateTo({url: '/pages/play/play'});
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
}
