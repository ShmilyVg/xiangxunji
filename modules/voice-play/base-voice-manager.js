export default class BaseVoiceManager {
    constructor() {
        this.backgroundAudioManager = wx.getBackgroundAudioManager();

        this.backgroundAudioManager.onError(err => {
            console.error('backgroundAudioManager 报错', err);
        });
        this.backgroundAudioManager.onEnded(res => {
            console.log('backgroundAudioManager播放结束', res);
            // this.backgroundAudioManager.src = this.backgroundAudioSrc;
            // this.backgroundAudioManager.play();
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

    onTimeUpdate({callback}) {
        this.backgroundAudioManager.onTimeUpdate(callback);
    }

    onPlay({callback}) {
        this.backgroundAudioManager.onPlay(callback);
    }

    play({src, title}) {
        return new Promise(resolve => {
            const bgAManager = this.backgroundAudioManager;
            this.backgroundAudioSrc = src;
            bgAManager.src = this.backgroundAudioSrc;
            bgAManager.title = title;
            bgAManager.play();
            resolve({src, title});
        });
    }

    playCurrentVoice() {
        const bgAManager = this.backgroundAudioManager;
        if (bgAManager.pause) {
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

