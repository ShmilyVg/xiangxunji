export default class LBlueToothProtocolOperator {

    constructor({blueToothManager, protocolSendBody, protocolReceiveBody}) {
        this.blueToothManager = blueToothManager;
        this.sendData = ({command, data}) => {
            return blueToothManager.sendData({buffer: this.createBuffer({command, data})});
        };
        this.receive = ({receiveBuffer}) => {
            return protocolReceiveBody.receive({action: this.action, receiveBuffer});
        };

        this.createBuffer = ({command, data}) => {
            return protocolSendBody.createBuffer({command, data});
        };
        this.action = this.getAction();
    }

    getAction() {
        return {};
    }
}