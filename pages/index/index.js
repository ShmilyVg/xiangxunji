import {getMindPractiseList, getWelcomeContent, getWelcomeTime, getWhiteNoiseListAtIndexPage} from "./data-manager";
import HiNavigator from "../../navigator/hi-navigator";
import Storage from "../../utils/storage";

const app = getApp();
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
    async onVoiceItemClickEvent({currentTarget: {dataset: {id}}}) {
        if (this.data.showRemindDialogObj.play) {
            this.setData({
                'showRemindDialogObj.play': false
            });
        }
        HiNavigator.navigateToPlayPage({id});
    },

    async remindDismissEvent({currentTarget: {dataset: {type}}}) {
        const obj = {};
        obj[`showRemindDialogObj.${type}`] = false;
        this.setData(obj);
    },

    onConnectStateChanged({detail: {connectState}}) {
        console.log('index.js [onConnectStateChanged] new connectState is:', connectState);
    },
    onGetUserInfo(e) {
        console.log(e);
    },
    onShow() {
        this.setData({
            'welcomeObj.title': getWelcomeTime()
        });
    },

    async onLoad() {
        await Storage.setIndexPageRemind();

    },

});
