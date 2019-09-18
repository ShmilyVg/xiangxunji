/**
 * 微信小程序蓝牙功能的底层封装
 * 该类的所有业务均为最基础的部分，是不需要进行修改的
 * 呵呵哒认为这个类是抽象的，这就意味着该类只能被继承(虽然JS中没有抽象类)
 *
 */

import {ErrorState} from "../utils/error-state";
import * as mta from "../../../analysis/mta";
import CommonProtocol from "../../../network/network/libs/protocol";
import {createBLEConnection, getBLEDeviceCharacteristics, getBLEDeviceServices} from "./apis";

const INIT_TIMEOUT = 10;
export default class AbstractBlueTooth {
    constructor() {

    }

    init() {
        setTimeout(() => {
            this.isBugPhone = getApp().globalData.systemInfo.isBugPhone;
        });
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

    getDeviceMacAddress() {
        return this._deviceId || wx.getStorageSync('deviceId');
    }

    setDeviceMacAddress({macId}) {
        try {
            wx.setStorageSync('deviceId', this._deviceId = macId);
        } catch (e) {
            console.log('setDeviceMacAddress()出现错误 deviceId=', this._deviceId);
            wx.setStorageSync('deviceId', this._deviceId = macId);
            console.log('setDeviceMacAddress()重新存储成功');
        }
    }

    /**
     * 打开蓝牙适配器
     * 只有蓝牙开启的状态下，才可执行成功
     * @returns {Promise<any>}
     */
    openAdapter() {

    }

    /**
     * 关闭蓝牙适配器
     * @returns {Promise<any>}
     */
    closeAdapter() {


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

    /**
     * 建立蓝牙连接
     * @param deviceId
     * @param signPower
     * @returns {Promise<any>}
     */
    async connect({deviceId,signPower}) {
        // 操作之前先监听，保证第一时间获取数据
        const {} = await createBLEConnection({deviceId, timeout: 20000});
        wx.onBLECharacteristicValueChange((res) => {
            if (!this._receiveDataOutsideistener) {
                this._receiveDataInsideListener({receiveBuffer: res.value});
            } else {
                this._receiveDataOutsideistener(res);
            }
        });
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
     * @returns {Promise<any>}
     */
    sendData({buffer}) {
        return new Promise((resolve, reject) => {
            wx.writeBLECharacteristicValue({
                deviceId: this._deviceId,
                serviceId: this._serviceId,
                characteristicId: this._characteristicId,
                value: buffer.slice(0, 20),
                success: resolve,
                fail: reject
            })
        })
    }

    /**
     * 停止蓝牙扫描
     * @returns {Promise<any>}
     */
    stopBlueToothDevicesDiscovery() {


    }

    startBlueToothDevicesDiscovery() {

    }

    /**
     * 根据 uuid 获取处于已连接状态的设备。
     * @returns {Promise<any>}
     */
    getConnectedBlueToothDevices() {
        if (!Array.isArray(this.UUIDs)) {
            AbstractBlueTooth._throwUUIDsIsNotArrayError();
        }
        return new Promise((resolve, reject) =>
            wx.getConnectedBluetoothDevices({
                services: this.UUIDs,
                success: resolve, fail: reject
            }));
    }





    static _throwUUIDsIsNotArrayError() {
        throw new Error('the type of services is Array!Please check it out.');
    }

}
