export default class BaseVoiceManager {
    constructor() {
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        this._onTimeUpdateListener = null;
        this._onPlayListenerArray = [{
            context: this, listener() {
                const bgAManager = this.backgroundAudioManager, {duration: temDuration} = bgAManager,
                    duration = Math.floor(temDuration);
                let latestTime = -1;
                bgAManager.onTimeUpdate(() => {
                    const {currentTime: tempTime} = bgAManager, currentTime = Math.floor(tempTime);
                    if (latestTime < currentTime) {
                        latestTime = currentTime;
                        this._onTimeUpdateListener({currentTime, duration});
                    }
                });
            }
        }];
        this.backgroundAudioManager.onError(err => {
            console.error('backgroundAudioManager 报错', err);
        });
        this.backgroundAudioManager.onEnded(() => {
            console.log('backgroundAudioManager播放结束 是否暂停或停止', this.backgroundAudioManager.paused);
            // this.backgroundAudioManager.src = this.backgroundAudioSrc;
            // this.backgroundAudioManager.play();
        });
        this.backgroundAudioManager.onPlay(() => {
            for (const {listener, context} of this._onPlayListenerArray) {
                listener.call(context);
            }
        });
        // this.audioContext = wx.createInnerAudioContext();
        // wx.setInnerAudioOption({mixWithOther: true});
        // this.audioContext.onError(err => {
        //     console.error('audioContext 报错', err);
        // });
        // this.audioContext.onEnded(res => {
        //     console.log('audioContext播放结束', res);
        //     // this.audioContext.src = this.personAudio;
        //     // this.audioContext.play();
        // });
    }

    getCurrentTime() {
        return  Math.floor(this.backgroundAudioManager.currentTime);
    }

    getDuration() {
        return Math.floor(this.backgroundAudioManager.duration);
    }

    setOnPlayListener({listener, context}) {
        let item = this._onPlayListenerArray.find(item => item.context === context);
        if (!item) {
            this._onPlayListenerArray.push({listener, context});
        } else {
            item.listener = listener;
        }
    }

    removeOnPlayListener({context}) {
        const index = this._onPlayListenerArray.findIndex(item => item.context === context);
        index !== -1 && this._onPlayListenerArray.splice(index, 1);
    }

    setOnTimeUpdateListener({listener}) {
        this._onTimeUpdateListener = listener;
    }

    play({src, title}) {
        return new Promise(resolve => {
            const bgAManager = this.backgroundAudioManager;
            this.backgroundAudioSrc = src;
            bgAManager.src = this.backgroundAudioSrc;
            bgAManager.title = title;
            bgAManager.play();
            resolve();
        });
    }

    playCurrentVoice() {
        const bgAManager = this.backgroundAudioManager;
        if (bgAManager.paused) {
            bgAManager.play();
        }
    }

    pause() {
        const bgAManager = this.backgroundAudioManager;
        if (!bgAManager.paused) {
            bgAManager.pause();
        }
    }
}

