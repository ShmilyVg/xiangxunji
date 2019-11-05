import AbstractBlueTooth from "./abstract-bluetooth";
import {getStorageSync, removeStorageSync, setStorageSync} from "./wx/apis";
import {CommonConnectState} from "heheda-bluetooth-state";


function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}

export default class BaseBlueTooth extends AbstractBlueTooth {
    constructor() {
        super();
        this._onConnectStateChanged = null;
        this._onReceiveData = null;
        this._deviceId = this.getConnectedDeviceId();
        this._serviceId = '';
        this._characteristicId = '';
        this._latestConnectState = '';
        this._latestProtocolObj = {protocolState: '', value: {}};
    }

    /**
     * 在连接前，一定要先设置BLE监听
     *
     * @param onConnectStateChanged onConnectStateChanged中的参数包括{connectState:''}
     * @param onReceiveData onReceiveData中的参数包括了 {protocolState:'',value:{}}
     */
    setBLEListener({onConnectStateChanged, onReceiveData}) {
        this._onConnectStateChanged = onConnectStateChanged;
        this._onReceiveData = onReceiveData;
    }

    set latestConnectState(value) {
        if (this._latestConnectState !== value) {
            console.warn('蓝牙连接状态更新', value);
            this._onConnectStateChanged({connectState: value});
            this._latestConnectState = value;
        }
    }

    get latestConnectState() {
        return this._latestConnectState;
    }

    set latestProtocolInfo({protocolState, value}) {
        if (this._latestProtocolObj.protocolState !== protocolState) {
            this._onReceiveData({protocolState, value});
        } else {
            const {value: latestValue} = this._latestProtocolObj;
            if (Object.getOwnPropertyNames(latestValue) === Object.getOwnPropertyNames(value)) {
                for (let [key, item] of entries(latestValue)) {
                    if (item !== value[key]) {
                        this._onReceiveData({protocolState, value});
                        return;
                    }
                }
            } else {
                this._onReceiveData({protocolState, value});
            }
        }
    }

    async createBLEConnection({deviceId}) {
        try {
            const {serviceId, characteristicId} = await super.createBLEConnection({
                deviceId,
                valueChangeListener: this._onReceiveData
            });
            this._serviceId = serviceId;
            this._characteristicId = characteristicId;
            this.setDeviceId({deviceId});
            try {
                await super.stopBlueToothDevicesDiscovery();
            } catch (e) {
                console.error('连接完成后，停止扫描周围设备失败', e);
            }
            return {isConnected: true};
        } catch (error) {
            switch (error.errCode) {
                case -1:
                    console.log('已连接上，无需重新连接');
                    await super.stopBlueToothDevicesDiscovery();
                    return {isConnected: true};
                case 10000:
                case 10001:
                    this.latestConnectState = CommonConnectState.UNAVAILABLE;
                    super.resetAllBLEFlag();
                    return Promise.reject(error);
                case 10003:
                case 10012:
                    console.warn('连接不上', error);
                    // console.log('现重启蓝牙适配器');
                    // await super.closeAdapter();
                    // await super.openAdapter();
                    console.warn('准备开始重新扫描连接');
                    await this.startBlueToothDevicesDiscovery();//这里调用的是子类的startBlueToothDevicesDiscovery，因为子类有实现
                    return {isConnected: false, filter: true};//这种是需要重新执行一遍扫描连接流程的，filter是否过滤掉本次事件
                case 10004:
                    await super.closeBLEConnection({deviceId});
                    return await this.createBLEConnection({deviceId});
                default:
                    console.warn('连接失败，重新连接', error);
                    return await this.createBLEConnection({deviceId});
            }
        }
    }

    async sendData({buffer}) {
        return super.sendData({
            buffer,
            deviceId: this._deviceId,
            serviceId: this._serviceId,
            characteristicId: this._characteristicId
        });
    }

    /**
     * 获取连接过的设备id
     * @returns {string|*}
     */
    getConnectedDeviceId() {
        if (!this._deviceId) {
            this._deviceId = getStorageSync('lb_ble_$deviceId') || '';
        }
        return this._deviceId;
    }

    setDeviceId({deviceId}) {
        try {
            setStorageSync('lb_ble_$deviceId', this._deviceId = deviceId);
        } catch (e) {
            console.log('setDeviceMacAddress()出现错误 deviceId=', this._deviceId);
            setStorageSync('lb_ble_$deviceId', this._deviceId = deviceId);
            console.log('setDeviceMacAddress()重新存储成功');
        }
    }

    /**
     * 清除上一次连接的蓝牙设备
     * 这会导致断开目前连接的蓝牙设备
     * @returns {*|Promise<any>}
     */
    async clearConnectedBLE() {
        await super.closeAdapter();
        removeStorageSync('lb_ble_$deviceId');
        this._deviceId = '';
        this._serviceId = '';
        this._characteristicId = '';
        return Promise.resolve();
    }
}
