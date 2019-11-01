import {LBlueToothProtocolOperator} from "./lb-ble-common-protocol-operator/index";
import {ReceiveBody, SendBody} from "./lb-ble-xiangxunji-protocol-body/index";
import {CommonProtocolAction} from "./lb-ble-common-protocol-action/index";


export default class HiSmellBlueToothProtocol extends LBlueToothProtocolOperator {
    constructor(blueToothManager) {
        super({blueToothManager, protocolSendBody: new SendBody(), protocolReceiveBody: new ReceiveBody()});
    }

    getAction() {

        return {
            ...new CommonProtocolAction({context: this}).getCommonProtocolAction(),
            '0x50': () => {

            }
        };
    }


};
