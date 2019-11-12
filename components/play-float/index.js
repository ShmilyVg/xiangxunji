function commonAnimationAction({actionName}) {
    return new Promise(resolve => {
        this.setData({
            action: config[actionName]
        }, resolve);
    });
}

const app = getApp(), config = {
    playing: {
        state: 'playing',
        actions: [{
            iconName: 'pause',
            nextState: 'pause',
            async action({actionName}) {
                await commonAnimationAction.call(this, {actionName});
                this.triggerEvent('onActionClickEvent', {actionName});
            }
        }]
    },
    pause: {
        state: 'pause',
        actions: [
            {
                iconName: 'play',
                nextState: 'playing',
                async action({actionName}) {
                    await commonAnimationAction.call(this, {actionName});
                    this.triggerEvent('onActionClickEvent', {actionName});
                }
            }]
    },
};

Component({
    options: {
        addGlobalClass: true,
    },

    properties: {
        show: {
            type: Boolean,
            value: true
        }
    },

    data: {
        action: config.pause,
    },

    lifetimes: {
        async attached() {

        },

    },
    /**
     * 组件的方法列表
     */
    methods: {
        _cancel() {
            this.setData({
                show: false
            }, () => {
                this.triggerEvent('dismissPlayFloat');
            })
        },
        async _onActionClickListener({currentTarget: {dataset: {currentState, actionName}}}) {
            const target = config[currentState].actions.find(item => item.nextState === actionName);
            target && (await target.action.call(this, {actionName}));

        },
        _doNothing() {

        }
    }
});
