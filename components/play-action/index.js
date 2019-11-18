import {config, commonAnimationAction} from "./play-state";

Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {
        playState: {
            type: String,
            value: config.pause.state
        }
    },
    observers: {
        'playState'(newPlayState) {
            // 在 numberA 或者 numberB 被设置时，执行这个函数
            console.log('接收到newPlayState', newPlayState);
            if (!newPlayState) {
                return;
            }

            // const target = config[currentState].actions.find(item => item.nextState === actionName);
            // target && (await target.action.call(this, {actionName}));
            commonAnimationAction.call(this, {actionName: newPlayState});
        }
    },
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
        async _onActionClickListener({currentTarget: {dataset: {currentState, actionName}}}) {
            console.log(currentState, actionName);
            const target = config[currentState].actions.find(item => item.nextState === actionName);
            target && (await target.action.call(this, {actionName}));

        },
        _doNothing() {

        }
    }
});
