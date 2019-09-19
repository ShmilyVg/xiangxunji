/**
 * 微信小程序蓝牙功能的底层封装
 * 该类的所有业务均为最基础的部分，是不需要进行修改的
 * 呵呵哒认为这个类是抽象的，这就意味着该类只能被继承(虽然JS中没有抽象类)
 *
 */

import {
    closeBlueToothAdapter,
    createBLEConnection,
    getConnectedBlueToothDevices,
    notifyBLE,
    openBlueToothAdapter,
    startBlueToothDevicesDiscovery,
    stopBlueToothDevicesDiscovery,
    writeBLECharacteristicValue
} from "./apis";

export default class AbstractBlueTooth {
    constructor() {

    }

    /**
     * 处理从连接的蓝牙中接收到的数据
     * 该函数必须在子类中重写！
     * 也千万不要忘了在重写时给这个函数一个返回值，作为处理数据后，传递给UI层的数据
     * 可以参考_receiveDataInsideListener
     * @param receiveBuffer 从连接的蓝牙中接收到的数据
     * @returns 传递给UI层的数据
     */
    dealReceiveData({receiveBuffer}) {

    }

    /**
     * 打开蓝牙适配器
     * 只有蓝牙开启的状态下，才可执行成功
     * @returns {Promise<any>}
     */
    async openAdapter() {
        return await openBlueToothAdapter();
    }

    /**
     * 关闭蓝牙适配器
     * @returns {Promise<any>}
     */
    async closeAdapter() {
        return await closeBlueToothAdapter();
    }


    /**
     * 建立蓝牙连接
     * @param deviceId
     * @param valueChangeListener
     * @returns {Promise<{serviceId, characteristicId: *, deviceId: *}>}
     */
    async createBLEConnection({deviceId, valueChangeListener}) {
        // 操作之前先监听，保证第一时间获取数据
        await createBLEConnection({deviceId, timeout: 20000});
        wx.onBLECharacteristicValueChange((res) => {
            valueChangeListener && valueChangeListener({receiveBuffer: res.value});
        });

        return await notifyBLE({deviceId, targetServiceUUID: this._hiServiceUUID});
    }

    resetConnectTimeout() {

    }

    /**
     * 断开处于连接状态的蓝牙连接
     * @returns {Promise<any>}
     */
    closeBLEConnection() {

    }

    /**
     * 设置UUID数组
     * 这会让你在扫描蓝牙设备时，只保留该UUID数组的蓝牙设备，过滤掉其他的所有设备，提高扫描效率
     * @param services
     * @param hiServiceUUID
     */
    setUUIDs({services, hiServiceUUID}) {
        this._hiServiceUUID = hiServiceUUID;
        if (Array.isArray(services)) {
            this.UUIDs = services;
        } else {
            AbstractBlueTooth._throwUUIDsIsNotArrayError();
        }
    }

    /**
     * 发送二进制数据
     * @param buffer ArrayBuffer
     * @param deviceId
     * @param serviceId
     * @param characteristicId
     * @returns {Promise<any>}
     */
    async sendData({buffer, deviceId, serviceId, characteristicId}) {
        return await writeBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId,
            value: buffer.slice(0, 20)
        });
    }

    /**
     * 停止蓝牙扫描
     * @returns {Promise<any>}
     */
    async stopBlueToothDevicesDiscovery() {
        return await stopBlueToothDevicesDiscovery();
    }

    async startBlueToothDevicesDiscovery() {
        return await startBlueToothDevicesDiscovery({services: this.UUIDs, allowDuplicatesKey: true, interval: 100});
    }

    /**
     * 根据 uuid 获取处于已连接状态的设备。
     * @returns {Promise<any>}
     */
    async getConnectedBlueToothDevices() {
        if (!Array.isArray(this.UUIDs)) {
            AbstractBlueTooth._throwUUIDsIsNotArrayError();
        }
        return await getConnectedBlueToothDevices({services: this.UUIDs});
    }

    static _throwUUIDsIsNotArrayError() {
        throw new Error('the type of services is Array!Please check it out.');
    }


    /**
     * 清除上一次连接的蓝牙设备
     * 这会导致断开目前连接的蓝牙设备
     * @returns {*|Promise<any>}
     */
    clearConnectedBLE() {

        return new Promise((resolve) => {
            this.closeAdapter().finally(() => {
                wx.removeStorageSync('deviceId');
                this._deviceId = '';
                this.resetConnectTimeout();
                resolve();
            });
        });
    }

}
