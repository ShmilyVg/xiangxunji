import {getMindPractiseList, getWelcomeContent, getWelcomeTime, getWhiteNoiseListAtIndexPage} from "./data-manager";
import HiNavigator from "../../navigator/hi-navigator";
import {Storage} from "../../utils/storage";
import {dealAuthUserInfo} from "../../utils/util";
import UserInfo from "../../modules/network/network/libs/userInfo";

const App = getApp();
const haveShowRemindDialog = Storage.getIndexPageRemindHaveShow();
Page({
    data: {
        userInfo: {},
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

    async onGetUserInfo(e) {
        console.log(e);
        await dealAuthUserInfo(e);
        HiNavigator.navigateToUserCenter();
    },
    async onShow() {
        App.onAppBLEConnectStateChangedListener = ({connectState}) => {
            console.log('index.js [onShow] 接收到连接状态', connectState);
            this.setData({connectState});
        };
        this.setData({
            'welcomeObj.title': getWelcomeTime(),
            connectState: App.getBLEManager().getBLELatestConnectState(),
            ...await UserInfo.get()
        });
    },

    async onLoad() {
        await Storage.setIndexPageRemind();
    },

});
