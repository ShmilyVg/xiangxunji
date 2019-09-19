import {CommonConnectState} from "heheda-bluetooth-state";
import {ErrorState} from "../utils/error-state";
import BaseBlueTooth from "./base-bluetooth";

function inArray(arr, key, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === val) {
            return i;
        }
    }
    return -1;
}
/**
 * 蓝牙核心业务的封装
 */
export default class BaseBlueToothImp extends BaseBlueTooth {

    constructor() {
        super();
        this._hiDeviceName = '';
        this.errorType = {
            '-1': {
                errMsg: 'createBLEConnection:fail:already connect', type: CommonConnectState.CONNECTED,
            },
            '10000': {
                errMsg: 'closeBLEConnection:fail:not init', type: CommonConnectState.UNAVAILABLE,
            },
            '10001': {
                errMsg: '', type: CommonConnectState.UNAVAILABLE,
            },
            '10003': {
                errMsg: '', type: CommonConnectState.DISCONNECT,
            },
            '10004': {
                errMsg: '没有找到指定服务', type: CommonConnectState.DISCONNECT,
            },
            '10005': {
                errMsg: '获取特征值失败:fail', type: CommonConnectState.DISCONNECT,
            },
            '10006': {
                errMsg: 'closeBLEConnection:fail:no connection', type: CommonConnectState.DISCONNECT,
            },
            '10009': {
                errMsg: 'Android System not support', type: CommonConnectState.NOT_SUPPORT
            },
            '10012': {
                errMsg: 'createBLEConnection:fail:operate time out',
                type: CommonConnectState.DISCONNECT,
            },
            '10013': {
                errMsg: '连接deviceId为空或者是格式不正确',
                type: CommonConnectState.DISCONNECT,
            }
        };
        this.errorType[ErrorState.DISCOVER_TIMEOUT.errorCode] = ErrorState.DISCOVER_TIMEOUT;
        wx.onBluetoothAdapterStateChange((res) => {
            console.log('适配器状态changed, now is', res, '是否处于升级状态', getApp().isOTAUpdate);
            const {available, discovering} = res;

        });

        wx.onBLEConnectionStateChange((res) => {
            // 该方法回调中可以用于处理连接意外断开等异常情况
            console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);

        });
        wx.onBluetoothDeviceFound(async (res) => {
            await this.baseDeviceFindAction(res);
        });
    }


    async baseDeviceFindAction(res) {
        console.log('开始扫描', res);
        const myBindDeviceId = this._deviceId, {devices} = res;
        if (myBindDeviceId && !this._isConnectBindDevice) {
            for (let device of devices) {
                const deviceId = device.deviceId;
                if (deviceId === myBindDeviceId) {
                    this._isConnectBindDevice = true;
                    console.log('找到设备并开始连接', myBindDeviceId, device);
                    await super.createBLEConnection({deviceId});
                    super.updateBLEConnectState({state: CommonConnectState.CONNECTED});
                    break;
                }
            }


            // for (let i = 0, len = devices.length; i < len; i++) {
            //     const device = devices[i];
            //     const deviceId = device.deviceId;
            //     if (deviceId === myBindDeviceId) {
            //         this._isConnectBindDevice = true;
            //         console.log('找到设备并开始连接', myBindDeviceId, device);
            //         this._updateFinalState({
            //             promise: this.createBLEConnection({deviceId, signPower: device.RSSI})
            //         });
            //         break;
            //     }
            // }
        } else if (!myBindDeviceId) {
            const hiDeviceName = this._hiDeviceName || '';
            for (let device of devices) {
                if (device.localName && device.localName.toUpperCase().indexOf(hiDeviceName) !== -1) {
                    console.log('扫描到药盒，并开始连接', device);
                    await super.createBLEConnection({deviceId: device.deviceId});
                    break;
                }
            }
            // for (let i = 0, len = devices.length; i < len; i++) {
            //     const device = devices[i];
            //     if (device.localName && device.localName.toUpperCase().indexOf(hiDeviceName) !== -1) {
            //         console.log('扫描到药盒，并开始连接', device);
            //         this._bleSignPowerListener && this._bleSignPowerListener(devices);
            //         this._updateFinalState({
            //             promise: this.createBLEConnection({deviceId: device.deviceId, signPower: device.RSSI})
            //         });
            //         break;
            //     }
            //
            // }
        }
    }

    setUUIDs({services, hiServiceUUID, hiDeviceName}) {
        this._hiDeviceName = hiDeviceName;
        super.setUUIDs({services, hiServiceUUID});
    }

    clearConnectedBLE() {
        return super.clearConnectedBLE();
    }

    /**
     * 打开蓝牙适配器并扫描蓝牙设备，或是试图连接上一次的蓝牙设备
     * 通过判断this._deviceId来确定是否为首次连接。
     * 如果是第一次连接，则需要开启蓝牙扫描，通过uuid过滤设备，来连接到对应的蓝牙设备，
     * 如果之前已经连接过了，则这次会按照持久化的deviceId直接连接
     * @returns {*}
     */
    async openAdapterAndConnectLatestBLE() {
        console.log('deviceId', this._deviceId || 'undefined', '当前是否已连接');
        super.updateBLEConnectState({state: CommonConnectState.CONNECTING});
        await super.openAdapter();
        const connectedDeviceId = super.getConnectedDeviceId();
        if (connectedDeviceId) {
            await this._updateBLEConnectFinalState({promise: await super.createBLEConnection({deviceId: connectedDeviceId})});
        } else {
            await super.startBlueToothDevicesDiscovery();
        }
    }

    updateBLEState({state}) {
        return this._bleStateListener({state});
    }

    getState({connectState, protocolState}) {
        return {state: {connectState, protocolState}};
    }

    async _updateBLEConnectFinalState({promise}) {
        try {
            const result = await promise;
            super.updateBLEConnectState({state: CommonConnectState.CONNECTED});
            return result;
        } catch (e) {
            console.warn('_updateBLEConnectFinalState error', e);
        }
    }

}
