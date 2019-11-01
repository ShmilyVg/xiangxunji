/**
 * 微信小程序蓝牙功能的底层封装
 * 该类的所有业务均为最基础的部分，是不需要进行修改的
 * 呵呵哒认为这个类是抽象的，这就意味着该类只能被继承(虽然JS中没有抽象类)
 *
 */

import {
    closeBLEConnection,
    closeBlueToothAdapter,
    createBLEConnection,
    getConnectedBlueToothDevices,
    notifyBLE,
    openBlueToothAdapter,
    startBlueToothDevicesDiscovery,
    stopBlueToothDevicesDiscovery,
    writeBLECharacteristicValue
} from "./apis";


function dontNeedOperation({errMsg}) {
    console.warn(errMsg);
    return Promise.resolve({errMsg});
}

const bleDiscovery = {
    isStartDiscovery: false,
    /**
     * 停止蓝牙扫描
     * @returns {Promise<any>}
     */
    async stopBlueToothDevicesDiscovery() {
        if (this.isStartDiscovery) {
            const result = await stopBlueToothDevicesDiscovery();
            this.isStartDiscovery = false;
            console.log('关闭扫描周围设备');
            return result;
        } else {
            return dontNeedOperation({errMsg: '已关闭了扫描周围蓝牙设备，无需再次关闭'});
        }
    },
    async startBlueToothDevicesDiscovery() {
        if (!this.isStartDiscovery) {
            const result = await startBlueToothDevicesDiscovery({
                services: this.UUIDs,
                allowDuplicatesKey: true,
                interval: 300
            });
            console.log('开始扫描周围设备');
            this.isStartDiscovery = true;
            return result;
        } else {
            return dontNeedOperation({errMsg: '正在扫描周围蓝牙设备，无需再次开启扫描'});
        }

    }
};

const bleAdapter = {
    isOpenAdapter: false,
    /**
     * 打开蓝牙适配器
     * 只有蓝牙开启的状态下，才可执行成功
     * @returns {Promise<any>}
     */
    async openAdapter() {
        if (!this.isOpenAdapter) {
            const result = await openBlueToothAdapter();
            this.isOpenAdapter = true;
            console.log('打开蓝牙适配器成功');
            return result;
        } else {
            return dontNeedOperation({errMsg: '已打开了蓝牙适配器，无需重复打开'});
        }
    },

    /**
     * 关闭蓝牙适配器
     * @returns {Promise<any>}
     */
    async closeAdapter() {
        if (this.isOpenAdapter) {
            const result = await closeBlueToothAdapter();
            this.isOpenAdapter = false;
            console.log('关闭蓝牙适配器成功');
            return result;
        } else {
            return dontNeedOperation({errMsg: '已关闭了蓝牙适配器，无需重复关闭'});
        }
    }
};

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

    // async* operatorBLEAdapter() {
    //     let isOpenAdapter = false;
    //     for (; ;) {
    //         if (isOpenAdapter) {
    //             const result = await this.openAdapter();
    //
    //             yield
    //         }
    //
    //     }
    // }

    async openAdapter() {
        return await openBlueToothAdapter();
    }

    async closeAdapter() {
        return await closeBlueToothAdapter();
    }

    resetAllBLEFlag() {
        bleAdapter.isOpenAdapter = false;
        bleDiscovery.isStartDiscovery = false;
    }

    /**
     * 建立蓝牙连接
     * @param deviceId
     * @param valueChangeListener
     * @returns {Promise<{serviceId, characteristicId: *, deviceId: *}>}
     */
    async createBLEConnection({deviceId, valueChangeListener}) {
        // 操作之前先监听，保证第一时间获取数据
        await createBLEConnection({deviceId, timeout: 7000});
        wx.onBLECharacteristicValueChange((res) => {
            if (!!valueChangeListener) {
                const {value, protocolState, filter} = this.dealReceiveData({receiveBuffer: res.value});
                !filter && valueChangeListener({protocolState, value});
            }
        });

        return await notifyBLE({deviceId, targetServiceUUID: this._targetServiceUUID});
    }

    /**
     * 断开处于连接状态的蓝牙连接
     * @returns {Promise<any>}
     */
    async closeBLEConnection({deviceId}) {
        return await closeBLEConnection({deviceId});
    }

    /**
     * 设置蓝牙扫描和连接时的过滤信息
     * 这会让你在扫描蓝牙设备时，只保留该UUID数组的蓝牙设备，过滤掉其他的所有设备，提高扫描效率
     * @param services
     * @param targetServiceUUID
     */
    setFilter({services, targetServiceUUID}) {
        this._targetServiceUUID = targetServiceUUID;
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


    async startBlueToothDevicesDiscovery() {
        return await startBlueToothDevicesDiscovery({services: this.UUIDs, allowDuplicatesKey: true, interval: 350});
    }

    async stopBlueToothDevicesDiscovery() {
        return await stopBlueToothDevicesDiscovery();
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

}
