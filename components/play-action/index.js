const app = getApp(), config = {
    playing: {
        state: 'playing',
        actions: [{
            iconName: 'pause',
            nextState: 'pause',
            action({actionName}) {
                this.setData({
                    action: config[actionName]
                }, () => {
                    this.triggerEvent('onActionClickEvent', {actionName});
                });
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
                action({actionName}) {
                    this.setData({
                        action: config[actionName]
                    }, () => {
                        this.triggerEvent('onActionClickEvent', {actionName});
                    });
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

Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        action: config.pause

    },
    lifetimes: {
        async attached() {

        },

    },
    /**
     * 组件的方法列表
     */
    methods: {
        _onActionClickListener({currentTarget: {dataset: {currentState, actionName}}}) {

            console.log(currentState, actionName);
            const target = config[currentState].actions.find(item => item.nextState === actionName);
            target && target.action.call(this, {actionName});

        },
        _doNothing() {

        }
    }
});
