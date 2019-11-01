import {IBLEProtocolSendBody} from "../lb-ble-common-protocol-body/index";
import {HexTools} from "../lb-ble-common-tool/index";

export default class SendBody extends IBLEProtocolSendBody {

    getDataBeforeEffectiveData({command, effectiveData} = {}) {
        return [238];
    }

    getDataAfterEffectiveData({command, effectiveData} = {}) {
        const afterOne = 236;
        let checkSum = afterOne + HexTools.hexToNum(command);
        for (let item of this.getDataBeforeEffectiveData()) {
            checkSum += item;
        }
        for (let item of effectiveData) {
            checkSum += item;
        }
        return [afterOne, checkSum];
    }
}
