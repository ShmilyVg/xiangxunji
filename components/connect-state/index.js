import {ConnectState} from "../../modules/bluetooth/bluetooth-state";

const App = getApp(),
    stateOptions = {}, CLOSE_FOREVER = 'close_forever';
stateOptions[ConnectState.CONNECTING] = {
    show: true,
    showRetryBtn: false,
    connecting: true,
    text: '正在连接...'
};
stateOptions[ConnectState.UNAVAILABLE] = {
    show: true,
    showRetryBtn: false,
    connecting: true,
    text: '正在连接...'
};
stateOptions[ConnectState.CONNECTED] = {
    show: false,
    showRetryBtn: false,
    connecting: false,
    text: '已连接',
    dismiss: true
};
stateOptions[ConnectState.DISCONNECT] = {
    show: true,
    showRetryBtn: true,
    connecting: false,
    text: '没有找到香薰机，没关系，你可以'
};
stateOptions[CLOSE_FOREVER] = {
    show: false,
    dismiss: true
};
//自定义的NavigationBar
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {
        state: {
            type: String,
            value: ConnectState.CONNECTING
        }
    },
    observers: {
        'state'(newConnectState) {
            // 在 numberA 或者 numberB 被设置时，执行这个函数
            console.log('设置stateObj', newConnectState);
            if (this.data.closeForever || !newConnectState) {
                return;
            }
            this.setData({
                stateObj: stateOptions[newConnectState]
            }, () => {
                setTimeout(() => {
                    !!this.data.stateObj.dismiss && this.setData({
                        dismiss: true
                    });
                }, 1500);
            });
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        stateObj: stateOptions.connecting,
        dismiss: false,
        closeForever: false
    },
    pageLifetimes: {
        show() {
        },
        hide() {
        }
    },
    lifetimes: {
        created() {
        },
        attached() {
            // setTimeout(() => {
            //     this.setData({
            //         stateObj: stateOptions[CommonConnectState.CONNECTED]
            //     });
            // },1000)
        },

    },
    /**
     * 组件的方法列表
     */
    methods: {
        _closeConnectStateView() {
            this.setData({
                stateObj: {...this.data.stateObj, ...stateOptions[CLOSE_FOREVER],}
            }, () => {
                setTimeout(() => {
                    !!this.data.stateObj.dismiss && this.setData({
                        dismiss: true
                    });
                }, 1500);
            });
        },
        _toReconnectEvent() {
            App.getBLEManager().connect();
        },
    }
});
