import {CommonProtocolState} from "heheda-bluetooth-state";
import {HexTools} from "../lb-ble-common-tool/tools";

export default class IBLEProtocolReceiveBody {
    /**
     * @param commandIndex 命令字所在位置的索引
     * @param dataStartIndex 有效数据开始的索引
     */
    constructor({commandIndex, dataStartIndex}) {
        this.commandIndex = commandIndex;
        this.dataStartIndex = dataStartIndex;
    }

    /**
     * 处理接收的数据
     * @param action
     * @param receiveBuffer 从蓝牙底层获取到的蓝牙数据
     * @returns {{dataAfterProtocol, protocolState}|{protocolState: string}}
     */
    receive({action, receiveBuffer}) {
        const receiveArray = [...new Uint8Array(receiveBuffer.slice(0, 20))];
        let command = receiveArray[this.commandIndex];
        let commandHex = `0x${HexTools.numToHex(command)}`;
        console.log('IBLEProtocolReceiveBody receive command:', commandHex);
        let effectiveReceiveDataLength = this.getEffectiveReceiveDataLength({receiveArray});
        let dataArray;
        if (effectiveReceiveDataLength > 0) {
            const endIndex = this.dataStartIndex + effectiveReceiveDataLength;
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


    /**
     * 获取有效数据的字节长度
     * 有效数据字节长度是指，在协议中由你的业务规定的具有特定含义的值的总字节长度
     * 有效数据字节长度=一包数据总字节长度-帧头位字节长度（如果有的话）- 校验位字节长度（如果有的话）-其他固定的数值的位总字节长度（如果有的话）
     * For Example:
     * 0xaa 0x51 0x01 0x01 0x01 0xff 0xff 0xff 0xca 0x2a 这样的一包数据
     * 0xaa 是帧头，0x51是命令字，0xca是结束位，0x2a是校验位（这个检验位是我随便写的值），有效的数据字节长度是：
     *      10（一包数据总字节长度）- 1（帧头字节长度）-1 （命令字字节长度）-1 （结束位字节长度）-1 （校验位字节长度） = 6
     * @param receiveArray 接收到的一整包数据
     * @returns {number} 有效数据的字节长度
     */
    getEffectiveReceiveDataLength({receiveArray}) {
        return 0;
    }
}


