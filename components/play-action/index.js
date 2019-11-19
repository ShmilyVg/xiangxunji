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
            console.log('接收到newPlayState', newPlayState);
            if (!newPlayState) {
                return;
            }
            try{

            commonAnimationAction.call(this, {actionName: newPlayState});
            }catch (e) {
                console.error(e);
            }

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
            const target = config[currentState].actions.find(item => item.nextState === actionName);
            target && (await target.action.call(this, {actionName}));
        },
        _doNothing() {

        }
    }
});
