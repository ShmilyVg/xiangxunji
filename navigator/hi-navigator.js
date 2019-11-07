import CommonNavigator from "heheda-navigator";

export default class HiNavigator extends CommonNavigator {
    static navigateToPlayPage({id}) {
        this.navigateTo({url: `/pages/play/play?id=${id}`});
    }
}
