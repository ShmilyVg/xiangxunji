import {getMindPractiseList, getWelcomeContent, getWelcomeTime, getWhiteNoiseListAtIndexPage} from "./data-manager";
import HiNavigator from "../../navigator/hi-navigator";
import {Storage} from "../../utils/storage";

const App = getApp();
const haveShowRemindDialog = Storage.getIndexPageRemindHaveShow();
Page({
    data: {
        welcomeObj: {title: '', content: getWelcomeContent()},
        habits: [],
        minds: getMindPractiseList(),
        whiteNoiseList: getWhiteNoiseListAtIndexPage(),
        showRemindDialogObj: {
            'userCenter': !haveShowRemindDialog,
            'play': !haveShowRemindDialog
        }
    },
    async onVoiceItemClickEvent({currentTarget: {dataset: {mindVoiceId, noiseVoiceId}}}) {
        if (this.data.showRemindDialogObj.play) {
            this.setData({
                'showRemindDialogObj.play': false
            });
        }
        HiNavigator.navigateToPlayPage({mindVoiceId, noiseVoiceId});
    },

    async remindDismissEvent({currentTarget: {dataset: {type}}}) {
        const obj = {};
        obj[`showRemindDialogObj.${type}`] = false;
        this.setData(obj);
    },

    onGetUserInfo(e) {
        console.log(e);
        HiNavigator.navigateToUserCenter();
    },
    onShow() {
        App.onAppBLEConnectStateChangedListener = ({connectState}) => {
            console.log('index.js [onShow] 接收到连接状态', connectState);
            this.setData({connectState});
        };
        this.setData({
            'welcomeObj.title': getWelcomeTime(),
            connectState: App.getBLEManager().getBLELatestConnectState()
        });
    },

    async onLoad() {
        await Storage.setIndexPageRemind();
    },

});
