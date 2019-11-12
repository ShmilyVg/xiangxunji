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


    //事件处理函数
    bindViewTap() {
        wx.chooseMessageFile({
            count: 2,
            type: 'all',
            success: (res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                const [backgroundAudio, personAudio] = res.tempFiles;

                console.warn(backgroundAudio, personAudio);
                setTimeout(() => {
                    if (backgroundAudio) {
                        this.backgroundAudio = backgroundAudio.path;
                        this.backgroundAudioManager.src = this.backgroundAudio;
                        this.backgroundAudioManager.title = '白噪声';
                        this.backgroundAudioManager.play();
                    }

                    if (personAudio) {
                        this.personAudio = personAudio.path;
                        this.audioContext.src = this.personAudio;
                        this.audioContext.play();

                    }
                }, 2000);

            }
        })
    },

    onShow() {
        this.setData({
            'welcomeObj.title': getWelcomeTime()
        });
    },
    toReconnectEvent() {
        app.getBLEManager().connect();
    },
    async onLoad() {
        await Storage.setIndexPageRemind();
        this.backgroundAudioManager = app.getBackgroundAudioManager();

        this.backgroundAudioManager.onError(err => {
            console.error('backgroundAudioManager 报错', err);
        });
        this.backgroundAudioManager.onEnded(res => {
            console.log('backgroundAudioManager播放结束', res);
            this.backgroundAudioManager.src = this.backgroundAudio;
            this.backgroundAudioManager.play();
        });

        this.audioContext = wx.createInnerAudioContext();
        wx.setInnerAudioOption({mixWithOther: true});
        this.audioContext.onError(err => {
            console.error('audioContext 报错', err);
        });
        this.audioContext.onEnded(res => {
            console.log('audioContext播放结束', res);
            // this.audioContext.src = this.personAudio;
            // this.audioContext.play();
        });
    },

});
