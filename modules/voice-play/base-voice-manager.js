export default class BaseVoiceManager {
    constructor() {
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        this._onTimeUpdateListener = null;
        this._onPauseListener = null;
        this._onPlayListener = null;
        this._onPlayListenerForVoiceDuration = null;
        this.backgroundAudioManager.onError(err => {
            console.error('backgroundAudioManager 报错', err);
        });
        this.backgroundAudioManager.onEnded(() => {
            console.log('backgroundAudioManager播放结束 是否暂停或停止', this.backgroundAudioManager.paused);
            // this.backgroundAudioManager.src = this.backgroundAudioSrc;
            // this.backgroundAudioManager.title = this.backgroundAudioTitle;
            this._onPauseListener();
            this._onTimeUpdateListener({currentTime: this.getDuration(), duration: this.getDuration()});
        });
        this.backgroundAudioManager.onPlay(() => {
            this._onPlayListener();
            const bgAManager = this.backgroundAudioManager;
            let latestTime = -1, duration = this.getDuration();
            bgAManager.onTimeUpdate(() => {
                const currentTime = this.getCurrentTime();
                if (latestTime < currentTime) {
                    latestTime = currentTime;
                    !duration && (duration = this.getDuration());
                    this._onTimeUpdateListener({currentTime, duration});
                }
            });
            this._onPlayListenerForVoiceDuration && this._onPlayListenerForVoiceDuration({duration});
        });

        this.backgroundAudioManager.onPause(() => {
            this._onPauseListener();
        });
        this.backgroundAudioManager.onStop(() => {
            this._onPauseListener();
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
        return Math.floor(this.backgroundAudioManager.currentTime);
    }

    getVoiceDurationWhenPlay() {
        if (this.backgroundAudioManager.duration) {
            return Promise.resolve(this.getDuration());
        } else {
            return new Promise(resolve => {
                this._onPlayListenerForVoiceDuration = ({duration}) => {
                    resolve(duration);
                };
            });
        }
    }

    getDuration() {
        return Math.floor(this.backgroundAudioManager.duration);
    }

    setOnPauseListener({listener}) {
        this._onPauseListener = listener;
    }

    setOnPlayListener({listener}) {
        this._onPlayListener = listener;
    }

    setOnTimeUpdateListener({listener}) {
        this._onTimeUpdateListener = listener;
    }

    play({src, title}) {
        return new Promise(resolve => {
            const bgAManager = this.backgroundAudioManager;
            this.backgroundAudioSrc = src;
            this.backgroundAudioTitle = title;
            bgAManager.src = this.backgroundAudioSrc;
            bgAManager.title = this.backgroundAudioTitle;
            // bgAManager.seek(17);
            resolve();
        });
    }

    playCurrentVoice() {
        const bgAManager = this.backgroundAudioManager, {src, paused} = bgAManager;
        if (paused) {
            if (src) {
                bgAManager.play();
            } else {
                bgAManager.title = this.backgroundAudioTitle;
                bgAManager.src = this.backgroundAudioSrc;
            }
        }
    }

    pause() {
        const bgAManager = this.backgroundAudioManager;
        if (!bgAManager.paused) {
            bgAManager.pause();
        }
    }
}

