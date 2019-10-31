import {CommonConnectState, CommonProtocolState} from "heheda-bluetooth-state";
import {HexTools} from "./utils/tools";
import {ProtocolBody} from "./utils/protocol-body";
import {Protocol} from "../../network/network/index";

const commandIndex = 0, dataStartIndex = 1;

export default class HiBlueToothProtocol {

    constructor({blueToothManager, deviceIndexNum}) {
        this._blueToothManager = blueToothManager;
        this._protocolQueue = [];
        this.protocolBody = new ProtocolBody({commandIndex, dataStartIndex, deviceIndexNum});
        this.action = {
            //由手机发出的连接请求
            '0x01': () => {
                this.sendData({command: '0x01'});
            },
            //由设备发出的连接反馈 1接受 2不接受 后面的是
            '0x02': ({dataArray}) => {
                const isConnected = HexTools.hexArrayToNum(dataArray.slice(0, 1)) === 1;
                const deviceId = HexTools.hexArrayToNum(dataArray.slice(1));
                console.log('绑定结果', dataArray, deviceId, isConnected);
                //由手机回复的连接成功
                if (isConnected) {
                    Protocol.postDeviceBind({
                        deviceId,
                        mac: blueToothManager.getDeviceMacAddress()
                    }).then(() => {
                        console.log('绑定协议发送成功');
                        this.startCommunication();
                        blueToothManager.sendQueryDataRequiredProtocol();
                        blueToothManager.executeBLEReceiveDataCallBack(
                            {protocolState: CommonProtocolState.CONNECTED_AND_BIND},
                        );
                    }).catch((res) => {
                        console.log('绑定协议报错', res);
                        blueToothManager.updateBLEConnectState({connectState: CommonConnectState.UNBIND});
                    });
                } else {
                    blueToothManager.clearConnectedBLE();
                }
            },
            //App发送绑定成功
            '0x03': () => {
                this.sendData({command: '0x03'});
            },
            //由设备发出的时间戳请求，并隔一段时间发送同步数据
            '0x04': ({dataArray}) => {
                const battery = HexTools.hexArrayToNum(dataArray.slice(0, 1));
                const version = HexTools.hexArrayToNum(dataArray.slice(1, 3));
                const deviceId = HexTools.hexArrayToNum(dataArray.slice(3, 11));
                this._syncCount = HexTools.hexArrayToNum(dataArray.slice(11, 13)) || 0;
                const now = Date.now() / 1000;
                this.sendData({command: '0x05', data: [now]}).then(() => {
                    this.sendQueryDataRequiredProtocol();
                });
                return {protocolState: CommonProtocolState.TIMESTAMP, dataAfterProtocol: {battery, version, deviceId}};
            },
            //设备发出待机状态通知
            '0x06': () => {
                this.sendData({command: '0x07'});
                return {protocolState: CommonProtocolState.DORMANT};
            },
            //由手机发出的查找设备请求
            '0x08': () => {
                this.sendData({command: '0x08'});
            },
            //设备反馈的查找设备结果，找到了设备
            '0x09': () => {
                return {protocolState: CommonProtocolState.FIND_DEVICE};
            },
            //App请求同步数据
            '0x0a': () => {
                this.sendData({command: '0x0a'}).then(() => blueToothManager.executeBLEReceiveDataCallBack({protocolState: CommonProtocolState.QUERY_DATA_START}));
            },
            //App传给设备同步数据的结果
            '0x0b': ({isSuccess}) => {
                this.sendData({
                    command: '0x0b',
                    data: [isSuccess ? 1 : 2]
                });
            },
        }
    }

    requireDeviceBind() {
        console.log('发送绑定消息');
        this.action['0x01']();
    }

    sendQueryDataRequiredProtocol() {
        const queryDataTimeoutIndex = setTimeout(() => {
            this.action['0x0a']();
        }, 200);
        this._protocolQueue.push(queryDataTimeoutIndex);
    }

    sendData({command, data}) {
        return this._blueToothManager.sendData({buffer: this.createBuffer({command, data})});
    }

    sendQueryDataSuccessProtocol({isSuccess}) {
        this.action['0x0b']({isSuccess});
    }

    startCommunication() {
        this.action['0x03']();
    }

    clearSendProtocol() {
        let temp;
        while ((temp = this._protocolQueue.pop())) {
            clearTimeout(temp);
        }
    }

    receive({receiveBuffer}) {
        return this.protocolBody.receive({action: this.action, receiveBuffer});
    }

    createBuffer({command, data}) {
        return this.protocolBody.createBuffer({command, data});
    }
}
