import {HexTools} from "../lb-ble-common-tool/index";

export default class IBLEProtocolSendBody {
    createBuffer({command, data}) {
        const dataBody = this.createDataBody({command, data});
        return new Uint8Array(dataBody).buffer;
    }

    createUpdateBuffer({index, data}) {
        const dataBody = createUpdateDataBody({index, data});
        return new Uint8Array(dataBody).buffer;
    }


    /**
     * 生成协议
     * 格式是 [...有效数据前的数据，命令字，...有效数据，...有效数据之后的数据]
     * @param command
     * @param data
     * @returns {*[]}
     */
    createDataBody({command = '', data = []}) {
        return [...this.getDataBeforeEffectiveData({
            command,
            effectiveData: data
        }),
            HexTools.hexToNum(command),
            ...data,
            ...this.getDataAfterEffectiveData({
                command,
                effectiveData: data
            })];
    }


    getDataBeforeEffectiveData({command, effectiveData} = {}) {
        return [];
    }

    /**
     * 获取有效数据之后的数据，包括校验位
     * @param command
     * @param effectiveData
     * @returns {Array}
     */
    getDataAfterEffectiveData({command, effectiveData} = {}) {
        return []
    }
}

function createUpdateDataBody({index, data = []}) {
    const dataPart = [];
    data.map(item => HexTools.numToHexArray(item)).forEach(item => dataPart.push(...item));
    let indexArray = HexTools.numToHexArray(index);
    indexArray.length === 1 && indexArray.unshift(0);
    return [170, ...indexArray, ...dataPart];
}
