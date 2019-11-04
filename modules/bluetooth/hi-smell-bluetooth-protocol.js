import {LBlueToothProtocolOperator} from "./lb-ble-common-protocol-operator/index";
import {ReceiveBody, SendBody} from "./lb-ble-xiangxunji-protocol-body/index";

export default class HiSmellBlueToothProtocol extends LBlueToothProtocolOperator {
    constructor(blueToothManager) {
        super({blueToothManager, protocolSendBody: new SendBody(), protocolReceiveBody: new ReceiveBody()});
    }

    getAction() {
        return {
            /**
             * 读取香薰机状态
             */
            '0x56': () => {
                this.sendData({command: '0x56', data: [0, 0, 0, 0, 0, 0]});
            },
            '0x62': ({dataArray}) => {
                console.log('接收到的0x62的数据 从byte2开始', dataArray);
            },
            '0x63': ({dataArray}) => {
                console.log('接收到的0x63的数据 从byte2开始', dataArray);
            },
            '0x64': ({dataArray}) => {
                console.log('接收到的0x64的数据 从byte2开始', dataArray);
            },
            '0x65': ({dataArray}) => {
                console.log('接收到的0x65的数据 从byte2开始', dataArray);

            },

        };
    }

    getDeviceAllStatus() {
        this.action['0x56']();
    }

};
