import SimpleBlueToothImp from "./base/simple-bluetooth-imp";
import {CommonConnectState, CommonProtocolState} from "heheda-bluetooth-state";

const MAX_WRITE_NUM = 5;
export default class LBlueToothManager extends SimpleBlueToothImp {

    constructor({debug = true} = {}) {
        super();
        this.debug = debug;
        this._BLEPush = [];
        this.reWriteIndex = 0;
        wx.onAppShow(() => {
            if (this.getBLELatestConnectState() === CommonConnectState.CONNECTED) {
                setTimeout(async () => {
                    await this.resendBLEData();
                }, 20);
            } else {
                this._BLEPush.splice(0, this._BLEPush.length);
            }
        });
    }

    async resendBLEData() {
        if (this._BLEPush && this._BLEPush.length) {
            let item;
            while (!!(item = this._BLEPush.shift())) {
                this.debug && console.warn('回到前台，重新发送蓝牙协议', item);
                await this._sendData(item);
            }
        }
    }

    /**
     * 发送数据细节的封装
     * 这里根据你自己的业务自行实现
     * @param buffer
     */
    sendData({buffer}) {
        return new Promise((resolve, reject) => {
            this.sendDataCatchError({buffer}).then(resolve).catch(({needReconnect = false} = {}) => {
                if (!needReconnect) {
                    return reject();
                }
            });
        });
    }

    sendDataCatchError({buffer}) {
        return new Promise(async (resolve, reject) => {
            // if (buffer && buffer.byteLength) {
            if (getApp().isAppOnShow) {
                await this._sendData({buffer, resolve, reject});
            } else {
                this._BLEPush.push({buffer, resolve, reject});
                this.debug && console.warn('程序进入后台，停止发送蓝牙数据，数据放入队列', this._BLEPush);
            }
        });
    }

    async _sendData({buffer, resolve, reject}) {
        try {
            const result = await super.sendData({buffer});
            if (this.debug) {
                console.log('writeBLECharacteristicValue success成功', result.errMsg);
                const dataView = new DataView(buffer, 0);
                const byteLength = buffer.byteLength;
                for (let i = 0; i < byteLength; i++) {
                    console.log(dataView.getUint8(i));
                }
            }
            resolve();
        } catch (e) {
            this.debug && console.log('写入失败', e);
            if (e.errCode === 10008 && this.reWriteIndex <= MAX_WRITE_NUM) {
                await this._sendData({buffer, resolve, reject});
            } else {
                this._BLEPush.push({buffer, resolve, reject});
                this.closeAll().finally(() => {
                    this.connect();
                });
                reject({needReconnect: true});
            }
        }
    }

    clearConnectedBLE() {
        return super.clearConnectedBLE();
    }

    /**
     * 关闭蓝牙适配器
     * 调用此接口会先断开蓝牙连接，停止蓝牙设备的扫描，并关闭蓝牙适配器
     * @returns {PromiseLike<boolean | never> | Promise<boolean | never>}
     */
    closeAll() {
        this.bluetoothProtocol.clearSendProtocol();
        return super.closeAll();
    }

    startProtocol() {
        // console.log('startProtocol');
        // this.bluetoothProtocol.openWater({open: true, duration: 100});
    }

    sendQueryDataRequiredProtocol() {
        this.bluetoothProtocol.sendQueryDataRequiredProtocol();
    }

    /**
     * 处理从蓝牙设备接收到的数据的具体实现
     * 这里会将处理后的数据，作为参数传递给setBLEListener的receiveDataListener监听函数。
     * @param receiveBuffer ArrayBuffer类型 接收到的数据的最原始对象，该参数为从微信的onBLECharacteristicValueChange函数的回调参数
     * @returns {*}
     */
    dealReceiveData({receiveBuffer}) {
        const {dataAfterProtocol, protocolState} = this.bluetoothProtocol.receive({receiveBuffer});
        if (CommonProtocolState.UNKNOWN === protocolState) {
            return {filter: true};
        }
        this.logReceiveData({receiveBuffer});
        return {value: dataAfterProtocol, protocolState};
    }

    /**
     * 打印接收到的数据
     * @param receiveBuffer
     */
    logReceiveData({receiveBuffer}) {
        if (this.debug) {
            const byteLength = receiveBuffer.byteLength;
            const dataView = new DataView(receiveBuffer, 0);
            for (let k = 0; k < byteLength; k++) {
                console.log(`接收到的数据索引：${k} 值：${dataView.getUint8(k)}`);
            }
        }
    }
};
