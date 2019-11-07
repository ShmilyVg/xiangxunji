import {getMindPractiseList, getWelcomeContent, getWelcomeTime, getWhiteNoiseList} from "./data-manager";
import HiNavigator from "../../navigator/hi-navigator";

const app = getApp();

Page({
    data: {
        welcomeObj: {title: '', content: getWelcomeContent()},
        habits: [],
        minds: getMindPractiseList(),
        whiteNoiseList: getWhiteNoiseList()
    },
    onMindPracticeClickEvent({currentTarget: {dataset: {id}}}) {
        HiNavigator.navigateToPlayPage({id});
    },
    onWhiteNoiseClickEvent({currentTarget: {dataset: {id}}}) {
        HiNavigator.navigateToPlayPage({id});
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
        console.log('开始执行index.js中的onShow()', this);
        this.setData({
            'welcomeObj.title': getWelcomeTime()
        });
    },
    toReconnectEvent() {
        app.getBLEManager().connect();
    },
    onLoad() {
        console.log('开始执行index.js中的onLoad()', this);
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
