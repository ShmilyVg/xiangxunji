import CommonNavigator from "heheda-navigator";

export default class HiNavigator extends CommonNavigator {
    static navigateToMoreSetting() {
        this.navigateTo({url: '/pages/setting/setting'});
    }
}
