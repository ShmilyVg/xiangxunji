export default class LBlueToothProtocolOperator {

    constructor({blueToothManager, protocolSendBody, protocolReceiveBody}) {
        this.blueToothManager = blueToothManager;
        this._protocolQueue = [];
        this.createBuffer = ({command, data}) => {
            return protocolSendBody.createBuffer({command, data});
        };
        this.sendData = ({command, data}) => {
            return blueToothManager.sendData({buffer: this.createBuffer({command, data})});
        };
        this.receive = ({receiveBuffer}) => {
            return protocolReceiveBody.receive({action: this.receiveAction, receiveBuffer});
        };


        this.receiveAction = this.getReceiveActionProtocol();
        this.sendAction = this.getSendActionProtocol();
    }

    clearSendProtocol() {
        let temp;
        while ((temp = this._protocolQueue.pop())) {
            clearTimeout(temp);
        }
    }

    getReceiveActionProtocol() {
        return {};
    }

    getSendActionProtocol() {
        return {};
    }
}
