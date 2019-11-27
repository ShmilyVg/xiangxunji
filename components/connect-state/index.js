import {ConnectState} from "../../modules/bluetooth/bluetooth-state";

const App = getApp(),
    stateOptions = {};
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
    text: '已连接'
};
stateOptions[ConnectState.DISCONNECT] = {
    show: true,
    showRetryBtn: true,
    connecting: false,
    text: '与设备连接中断，点击此处'
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
            if (!newConnectState) {
                return;
            }
            this.setData({
                stateObj: stateOptions[newConnectState]
            });
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        stateObj: stateOptions.connecting
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
        },

    },
    /**
     * 组件的方法列表
     */
    methods: {
        _toReconnectEvent() {
            App.getBLEManager().connect();
        },
    }
});
