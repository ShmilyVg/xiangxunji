import {CommonConnectState} from "heheda-bluetooth-state";
import BaseBlueTooth from "./base-bluetooth";

/**
 * 蓝牙核心业务的封装
 */
export default class BaseBlueToothImp extends BaseBlueTooth {

    constructor() {
        super();
        this._hiDeviceName = '';
        const that = this;
        wx.onBluetoothAdapterStateChange((function () {
            let available = true;
            return async (res) => {
                console.log('适配器状态changed, now is', res);
                // discovering
                const {available: nowAvailable} = res;
                if (!nowAvailable) {
                    await that.closeAdapter();
                } else if (!available) {//当前适配器状态是可用的，但上一次是不可用的，说明是用户刚刚重新打开了
                    await that.openAdapterAndConnectLatestBLE();
                }
                available = nowAvailable;
            }
        })());

        wx.onBLEConnectionStateChange((res) => {
            // 该方法回调中可以用于处理连接意外断开等异常情况
            const {deviceId, connected} = res;
            console.log(`device ${deviceId} state has changed, connected: ${connected}`);
            if (!connected) {
                this.openAdapterAndConnectLatestBLE();
            }
        });
        wx.onBluetoothDeviceFound(async (res) => {
            await this.baseDeviceFindAction(res);
        });
    }


    async baseDeviceFindAction(res) {
        console.log('开始扫描', res);
        const myBindDeviceId = this._deviceId, {devices} = res;
        if (!this._isConnectBindDevice) {
            if (myBindDeviceId) {
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

            } else if (!myBindDeviceId) {
                const hiDeviceName = this._hiDeviceName || '';
                for (let device of devices) {
                    if (device.localName && device.localName.toUpperCase().indexOf(hiDeviceName) !== -1) {
                        this._isConnectBindDevice = true;
                        console.log('扫描到药盒，并开始连接', device);
                        await super.createBLEConnection({deviceId: device.deviceId});
                        break;
                    }
                }

            }
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
        await super.openAdapter();
        super.updateBLEConnectState({state: CommonConnectState.CONNECTING});
        const connectedDeviceId = super.getConnectedDeviceId();
        if (connectedDeviceId) {
            console.log(`上次连接过设备${connectedDeviceId}，现在直接连接该设备`);
            await this._updateBLEConnectFinalState({promise: await super.createBLEConnection({deviceId: connectedDeviceId})});
        } else {
            console.log('上次未连接过设备，现开始扫描周围设备');
            await this.startBlueToothDevicesDiscovery();
        }
    }

    async startBlueToothDevicesDiscovery() {
        this._isConnectBindDevice = false;
        return super.startBlueToothDevicesDiscovery();
    }

    updateBLEState({state}) {
        return this._bleStateListener({state});
    }

    getState({connectState, protocolState}) {
        return {state: {connectState, protocolState}};
    }

    /**
     * 统一处理一次蓝牙连接流程
     * 如果接收到失败，则是需要重新执行一遍扫描连接流程的情况
     * @param promise
     * @returns {Promise<*>}
     * @private
     */
    async _updateBLEConnectFinalState({promise}) {
        try {
            const result = await promise;
            if (result.isConnected && !result.filter) {
                super.updateBLEConnectState({state: CommonConnectState.CONNECTED});
            }
            return result;
        } catch (e) {
            switch (e.errCode) {
                case 10000:
                case 10001:
                    super.updateBLEConnectState({state: CommonConnectState.UNAVAILABLE});
                    break;

            }
        }
    }

}
