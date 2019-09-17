//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        pageName:''
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
    onLoad() {
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
