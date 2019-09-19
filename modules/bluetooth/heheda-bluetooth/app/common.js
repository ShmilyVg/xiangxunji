import "heheda-update";

import {Login, Protocol, UserInfo} from "../../../network/network/index";
import {CommonConnectState, CommonProtocolState} from "heheda-bluetooth-state";
import {listener} from "./listener";
import {SoftwareVersion} from "../../../../utils/config";


const obj = {
    NOT_REGISTER: 'not_register',
    commonOnLaunch({options, bLEManager, needNetwork = true}) {
        wx.getSystemInfo({
            success: systemInfo => {
                this.globalData.systemInfo = systemInfo;
                console.warn('系统信息', systemInfo);
                const model = systemInfo.model;
                this.globalData.systemInfo.isBugPhone = model.indexOf('iPhone 6') !== -1 || model.indexOf('iPhone 7') !== -1;
            }, complete: () => {
                bLEManager.init();
                needNetwork && this.doLogin();
            }
        });
        this.bLEManager = bLEManager;
        this.appIsConnected = false;
        this.bLEManager.setBLEListener({
            listener: ({connectState,protocolState,value}) => {

            },

            receiveDataListener: ({finalResult, state}) => {
                this.commonAppReceiveDataListener && this.commonAppReceiveDataListener({finalResult, state});
            }, bleStateListener: ({state}) => {
                this.bLEManager.latestState = state;
                console.log('状态更新', state, 'isConnected:', this.appIsConnected);
                switch (state.connectState) {
                    case CommonConnectState.CONNECTED:
                        if (!this.appIsConnected) {
                            this.bLEManager.startProtocol();
                            this.appIsConnected = true;
                        }
                        break;
                    case CommonConnectState.CONNECTING:
                    case CommonConnectState.UNBIND:
                    case CommonConnectState.DISCONNECT:
                    case CommonConnectState.UNAVAILABLE:
                        this.appIsConnected = false;
                        break;

                }
                this._updateBLEState({state});
            }
        })
    },
    commonOnShow({options}) {
        this.isAppOnShow = true;
        // setTimeout(() => {
        //     this.bLEManager.getBindMarkStorage() && this.bLEManager.connect();
        // }, 200);
    },
    commonOnHide() {
        // this.bLEManager.closeAll();
        this.isAppOnShow = false;
    },

    connectAppBLE() {
        let isConnectOnce = false;
        return this.connectAppBLE = ({macId} = {}) => {
            if (!isConnectOnce) {
                isConnectOnce = true;
                this.bLEManager.getBindMarkStorage() && this.bLEManager.connect({macId});
            }
        }
    },

    onGetUserInfo: null,

    getBLEManager() {
        return this.bLEManager;
    },

    setCommonBLEListener({commonAppReceiveDataListener, commonAppBLEStateListener, commonAppSignPowerListener}) {
        this.commonAppReceiveDataListener = commonAppReceiveDataListener;
        this.commonAppBLEStateListener = commonAppBLEStateListener;
        this.commonAppSignPowerListener = commonAppSignPowerListener;
    },


    doLogin() {
        setTimeout(() =>
            Login.doLogin()
                .catch((res) => {
                    if (!!res.data && res.data.code === 2) {
                        this.appLoginListener && this.appLoginListener({loginState: this.NOT_REGISTER});
                    }
                })
                .then(() => UserInfo.get())
                .then(({userInfo}) => {
                    this.onGetUserInfo && this.onGetUserInfo({userInfo});
                    const systemInfo = this.globalData.systemInfo;
                    systemInfo && Protocol.postSystemInfo({systemInfo, hiSoftwareVersion: SoftwareVersion});
                }));
    },
};

const common = {...obj, ...listener};

export {common};
