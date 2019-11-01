import {CommonConnectState} from "heheda-bluetooth-state";
import BaseBlueTooth from "./base-bluetooth";
//
// function getHexStr(dataView, index) {
//     return ('0' + dataView.getUint8(index).toString(16)).slice(-2).toUpperCase();
// }

/**
 * 蓝牙核心业务的封装
 */
export default class BaseBlueToothImp extends BaseBlueTooth {

    constructor() {
        super();
        this._hiDeviceName = '';
        wx.onBluetoothAdapterStateChange((function () {
            let available = true;
            return async (res) => {
                console.log('适配器状态changed, now is', res);
                // discovering
                const {available: nowAvailable} = res;
                if (!nowAvailable) {
                    this.dealBLEUnavailableScene();
                } else if (!available) {//当前适配器状态是可用的，但上一次是不可用的，说明是用户刚刚重新打开了
                    await this.closeAdapter();
                    await this.openAdapterAndConnectLatestBLE();
                }
                available = nowAvailable;
            }
        }).call(this));

        wx.onBLEConnectionStateChange(async (res) => {
            // 该方法回调中可以用于处理连接意外断开等异常情况
            const {deviceId, connected} = res;
            console.log(`device ${deviceId} state has changed, connected: ${connected}`);
            if (!connected) {
                await this.openAdapterAndConnectLatestBLE();
                // this.latestConnectState = CommonConnectState.DISCONNECT;
                //     this.openAdapterAndConnectLatestBLE();
            }
        });
        wx.onBluetoothDeviceFound(async (res) => {
            console.log('开始扫描周边设备', res);
            if (!this._isConnectBindDevice) {
                const {devices} = res, {targetDevice} = this.findTargetDeviceNeedConnected({devices});
                if (targetDevice) {
                    const {deviceId} = targetDevice;
                    console.log('baseDeviceFindAction 扫描到目标设备，并开始连接', deviceId, targetDevice);
                    await this._updateBLEConnectFinalState({promise: super.createBLEConnection({deviceId})});
                }
            }
        });
    }


    findTargetDeviceNeedConnected({devices}) {
        const hiDeviceName = this._hiDeviceName, tempFilterArray = [];
        for (let device of devices) {
            if (device.localName && device.localName.includes(hiDeviceName)) {
                this._isConnectBindDevice = true;
                tempFilterArray.push(device);
            }
        }
        if (tempFilterArray.length) {
            const device = tempFilterArray.reduce((pre, cur) => {
                return pre.RSSI > cur.RSSI ? pre : cur;
            });
            return {targetDevice: device};
        }
        return {targetDevice: null};
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
        if (this.latestConnectState === CommonConnectState.CONNECTING) {
            console.warn('openAdapterAndConnectLatestBLE 蓝牙正在连接中，还未返回结果，所以取消本次连接');
            return;
        }
        console.warn('openAdapterAndConnectLatestBLE 连接前，读取最新的蓝牙状态：', this.latestConnectState || '未初始化');
        await this._updateBLEConnectFinalState({promise: super.openAdapter()});
        // await super.openAdapter();
        this.latestConnectState = CommonConnectState.CONNECTING;
        // const connectedDeviceId = super.getConnectedDeviceId();
        // if (connectedDeviceId) {
        //     console.log(`上次连接过设备${connectedDeviceId}，现在直接连接该设备`);
        //     await this._updateBLEConnectFinalState({promise: await super.createBLEConnection({deviceId: connectedDeviceId})});
        // } else {
        // console.log('上次未连接过设备或直连失败，现开始扫描周围设备');
        console.log('openAdapterAndConnectLatestBLE 现开始扫描周围设备');
        await this.startBlueToothDevicesDiscovery();
        // }
    }

    async startBlueToothDevicesDiscovery() {
        this._isConnectBindDevice = false;
        try {
            return super.startBlueToothDevicesDiscovery();
        } catch (e) {
            switch (e.errCode) {
                case 10000:
                case 10001:
                    this.dealBLEUnavailableScene();
                    break;

            }
        }
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
                this.latestConnectState = CommonConnectState.CONNECTED;
            }
            return result;
        } catch (e) {
            console.warn('_updateBLEConnectFinalState 蓝牙连接出现问题', e);
            switch (e.errCode) {
                case 10000:
                case 10001:
                    this.dealBLEUnavailableScene();
                    break;

            }
            return Promise.reject(e);
        }
    }

    dealBLEUnavailableScene() {
        this.latestConnectState = CommonConnectState.UNAVAILABLE;
        super.resetAllBLEFlag();
    }
}
