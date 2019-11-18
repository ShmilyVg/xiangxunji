import {AppVoiceDelegate} from "../../modules/voice-play/voice-delegate";

export function commonAnimationAction({actionName}) {
    return new Promise(resolve => {
        this.setData({
            opacity: 0
        }, () => {
            setTimeout(() => {
                this.setData({action: config[actionName],}, () => {
                    this.setData({
                        opacity: 1
                    });
                });
            }, 350);
            resolve();
        });
    });
}

export const config = {
    playing: {
        state: 'playing',
        actions: [{
            iconName: 'pause',
            nextState: 'pause',
            async action({actionName}) {
                await commonAnimationAction.call(this, {actionName});
                AppVoiceDelegate.pause();
                this.triggerEvent('onActionClickEvent', {actionName});
            }
        }]
    },
    pause: {
        state: 'pause',
        actions: [
            //     {
            //     iconName: 'stop',
            //     nextState: 'stop',
            //     action({actionName}) {
            //         this.setData({
            //             action: config[actionName]
            //         }, () => {
            //             this.triggerEvent('onActionClickEvent', {actionName});
            //         });
            //     }
            // },
            {
                iconName: 'play',
                nextState: 'playing',
                async action({actionName}) {
                    await commonAnimationAction.call(this, {actionName});
                    AppVoiceDelegate.playCurrentVoice();
                    this.triggerEvent('onActionClickEvent', {actionName});
                }
            }]
    },
    stop: {
        state: 'stop',
        actions: [{
            iconName: 'stop',
            nextState: 'stop',
            action({actionName}) {
                this.setData({
                    action: config[actionName]
                }, () => {
                    this.triggerEvent('onActionClickEvent', {actionName});
                });
            }
        },
            {
                iconName: 'play',
                nextState: 'playing',
                action({actionName}) {
                    this.setData({
                        action: config[actionName]
                    }, () => {
                        this.triggerEvent('onActionClickEvent', {actionName});
                    });
                }
            }]
    }
};
