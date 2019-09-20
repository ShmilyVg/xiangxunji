import {CommonProtocolState} from "heheda-bluetooth-state";
import {HexTools} from "./tools";

export class ProtocolBody {

    constructor({commandIndex, dataStartIndex, deviceIndexNum}) {
        this.commandIndex = commandIndex;
        this.dataStartIndex = dataStartIndex;
        // this.deviceIndexNum = deviceIndexNum;
    }

    receive({action, receiveBuffer}) {
        const receiveArray = [...new Uint8Array(receiveBuffer)];
        console.log('接收到的数据', receiveArray);
        let command = receiveArray[this.commandIndex];
        let commandHex = `0x${HexTools.numToHex(command)}`;
        console.log('命令字', commandHex);
        let dataLength = 4;
        let dataArray;
        if (dataLength > 0) {
            const endIndex = this.dataStartIndex + dataLength;
            dataArray = receiveArray.slice(this.dataStartIndex, endIndex);
        }
        const doAction = action[commandHex];
        if (doAction) {
            const actionTemp = doAction({dataArray});
            if (actionTemp && actionTemp.protocolState) {
                const {protocolState, dataAfterProtocol} = actionTemp;
                return {protocolState, dataAfterProtocol};
            } else {
                console.log('协议处理完成，并且返回无状态事件');
                return {protocolState: CommonProtocolState.UNKNOWN};
            }
        } else {
            console.log('协议中包含了unknown状态');
            return {protocolState: CommonProtocolState.UNKNOWN};
        }
    }

    createBuffer({command, data}) {
        const dataBody = this._createDataBody({command, data});
        return new Uint8Array(dataBody).buffer;
    }

    createUpdateBuffer({index, data}) {
        const dataBody = this._createUpdateDataBody({index, data});
        return new Uint8Array(dataBody).buffer;
    }

    _createUpdateDataBody({index, data = []}) {
        const dataPart = [];
        data.map(item => HexTools.numToHexArray(item)).forEach(item => dataPart.push(...item));
        let indexArray = HexTools.numToHexArray(index);
        indexArray.length === 1 && indexArray.unshift(0);
        return [170, ...indexArray, ...dataPart];
    }

    _createDataBody({command = '', data = []}) {
        const dataPart = [];
        data.map(item => HexTools.numToHexArray(item)).forEach(item => dataPart.push(...item));
        const array = [HexTools.hexToNum(command), ...dataPart];
        let count = 0;
        array.forEach(item => count += item);
        count = ~count + 1;
        array.push(count);
        return array;
    }

}
