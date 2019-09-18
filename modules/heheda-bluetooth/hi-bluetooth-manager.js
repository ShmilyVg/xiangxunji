import SimpleBlueToothImp from "./base/simple-bluetooth-imp";
import {CommonConnectState, CommonProtocolState} from "heheda-bluetooth-state";

const MAX_WRITE_NUM = 5;
export default class HiBlueToothManager extends SimpleBlueToothImp {

    constructor() {
        super();
        this.startProtocolTimeoutIndex = 0;
        this.latestState = {
            state: {
                connectState: CommonConnectState.UNBIND,
                protocolState: CommonProtocolState.UNKNOWN
            }
        };
        this._BLEPush = [];
        this.reWriteIndex = 0;
        wx.onAppShow(() => {
            if (this.getLatestState().connectState === CommonConnectState.CONNECTED) {
                setTimeout(() => {
                    this.resendBLEData();
                }, 20);
            } else {
                this._BLEPush.splice(0, this._BLEPush.length);
            }
        });
    }

    resendBLEData() {
        if (this._BLEPush && this._BLEPush.length) {
            let item;
            while (!!(item = this._BLEPush.shift())) {
                console.warn('回到前台，重新发送蓝牙协议', item);
                this._sendData(item);
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
        })
    }

    sendDataCatchError({buffer}) {
        return new Promise((resolve, reject) => {
            // if (buffer && buffer.byteLength) {
            if (getApp().isAppOnShow) {
                this._sendData({buffer, resolve, reject});
            } else {
                this._BLEPush.push({buffer, resolve, reject});
                console.warn('程序进入后台，停止发送蓝牙数据，数据放入队列', this._BLEPush);
            }
            // } else {
            //     console.log('发送的buffer是空');
            //     reject();
            // }
        });
    }

    _sendData({buffer, resolve, reject}) {
        super.sendData({buffer}).then(res => {
            resolve();
            console.log('writeBLECharacteristicValue success成功', res.errMsg);
            const dataView = new DataView(buffer, 0);
            const byteLength = buffer.byteLength;
            for (let i = 0; i < byteLength; i++) {
                console.log(dataView.getUint8(i));
            }
        }).catch(res => {
            console.log('写入失败', res);
            //TODO 推入队列
            if (res.errCode === 10008 && this.reWriteIndex <= MAX_WRITE_NUM) {
                this._sendData({buffer, resolve, reject});
            } else {
                this._BLEPush.push({buffer, resolve, reject});
                this.closeAll().finally(() => {
                    this.connect();
                });
                reject({needReconnect: true});
            }
            // let connectState = CommonConnectState.DISCONNECT;
            // if (res.errCode === 10001 || res.errCode === 10000) {
            //     connectState = CommonConnectState.UNAVAILABLE;
            // }
            // this.updateBLEStateImmediately(this.getState({connectState}));
            // setTimeout(() => this.closeAll().finally(() => this.connect()), 1000);
        });
    }

    getLatestState() {
        if (this.getBindMarkStorage()) {
            return this.latestState;
        }
        return this.latestState = this.getState({connectState: CommonConnectState.UNBIND});
    }

    clearConnectedBLE() {
        this.bluetoothProtocol.clearBindMarkStorage();
        return super.clearConnectedBLE();
    }

    getBindMarkStorage() {
        return this.bluetoothProtocol.getDeviceIsBind();
    }

    setBindMarkStorage() {
        this.bluetoothProtocol.setBindMarkStorage();
    }

    /**
     * 关闭蓝牙适配器
     * 调用此接口会先断开蓝牙连接，停止蓝牙设备的扫描，并关闭蓝牙适配器
     * @returns {PromiseLike<boolean | never> | Promise<boolean | never>}
     */
    closeAll() {
        this.bluetoothProtocol.clearSendProtocol();
        clearTimeout(this.startProtocolTimeoutIndex);
        return super.closeAll();
    }

    startProtocol() {
        clearTimeout(this.startProtocolTimeoutIndex);
        console.log('startProtocol');
        this.startProtocolTimeoutIndex = setTimeout(() => {
            this.getBindMarkStorage() ? this.bluetoothProtocol.startCommunication() : this.bluetoothProtocol.requireDeviceBind();
        }, 0);
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
        const {dataAfterProtocol, state} = this.bluetoothProtocol.receive({receiveBuffer});
        if (CommonProtocolState.UNKNOWN === state.protocolState) {
            return {filter: true};
        }
        this.latestState = state;
        super.updateBLEStateImmediately({state});
        HiBlueToothManager.logReceiveData({receiveBuffer});
        return {finalResult: dataAfterProtocol, state};
    }

    /**
     * 打印接收到的数据
     * @param receiveBuffer
     */
    static logReceiveData({receiveBuffer}) {
        const byteLength = receiveBuffer.byteLength;
        // const buffer = new ArrayBuffer(byteLength);
        const dataView = new DataView(receiveBuffer, 0);
        for (let k = 0; k < byteLength; k++) {
            console.log(`接收到的数据索引：${k} 值：${dataView.getUint8(k)}`);
        }
    }
};
