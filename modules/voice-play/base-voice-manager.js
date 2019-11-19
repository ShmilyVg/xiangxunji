export default class BaseVoiceManager {
    constructor() {
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        this._onTimeUpdateListener = null;
        this._onPauseListener = null;
        this._onPlayListener = null;
        this.backgroundAudioManager.onError(err => {
            console.error('backgroundAudioManager 报错', err);
        });
        this.backgroundAudioManager.onEnded(() => {
            console.log('backgroundAudioManager播放结束 是否暂停或停止', this.backgroundAudioManager.paused);
            this._onPauseListener();
            // this.backgroundAudioManager.src = this.backgroundAudioSrc;
            // this.backgroundAudioManager.play();
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
            // this._onPlayListener();
        }
    }

    pause() {
        const bgAManager = this.backgroundAudioManager;
        if (!bgAManager.paused) {
            bgAManager.pause();
        }
    }
}

