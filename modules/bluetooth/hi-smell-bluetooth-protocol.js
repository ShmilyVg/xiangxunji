import {ProtocolState} from "./bluetooth-state";
import HiBlueToothProtocol from "./heheda-bluetooth/hi-bluetooth-protocol";
import {HexTools} from "./heheda-bluetooth/utils/tools";


export default class HiSmellBlueToothProtocol extends HiBlueToothProtocol {
    constructor(blueToothManager) {
        super({blueToothManager, deviceIndexNum: 7});
        this.action = {
            ...this.action,
            //由手机发出的定时设置请求
            '0x30': ({singleAlertData}) => {
                return super.sendData({command: '0x30', data: singleAlertData});
            },
            //设备反馈定时设置结果
            '0x31': ({dataArray}) => {
                const isSetSingleAlertItemSuccess = HexTools.hexArrayToNum(dataArray.slice(0, 1)) === 1;
                return {
                    protocolState: ProtocolState.SEND_ALERT_TIME_RESULT,
                    dataAfterProtocol: {isSetSingleAlertItemSuccess}
                };
            },
            //设备返回要同步的数据
            '0x32': ({dataArray}) => {
                const length = HexTools.hexArrayToNum(dataArray.slice(0, 1));
                const isEat = HexTools.hexArrayToNum(dataArray.slice(1, 2)) === 1;
                const timestamp = HexTools.hexArrayToNum(dataArray.slice(2, 6));
                const compartment = HexTools.hexArrayToNum(dataArray.slice(6));
                return {
                    protocolState: ProtocolState.QUERY_DATA_ING,
                    dataAfterProtocol: {length, isEat, timestamp, compartment}
                };
            },
            //设置雾化间隔
            '0x81': () => {
                super.sendData({command: '0x81', data: [17, 1, 0, 0]});//时，分，秒   工作时间总长
                super.sendData({command: '0x81', data: [18, 0, 0, 30]});//时，分，秒  喷雾时间
                super.sendData({command: '0x81', data: [19, 0, 0, 10]});//时，分，秒  间隔时间
            },
            '0x82': ({open, duration}) => {``
                // super.sendData({command: '0x82', data: [1, duration, 0, 0]});//雾化倒计时工作
                // super.sendData({command: '0x82', data: [open ? 2 : 3, 0, 0, 0]});//2雾化打开 3雾化关闭
            },
            '0x85': ({dataArray}) => {
                const waterOpen = HexTools.hexArrayToNum(dataArray.slice(0, 1)); //雾化开关
                const waterDelay = HexTools.hexArrayToNum(dataArray.slice(1, 2));//雾化剩余时间

            },
            '0x88': ({dataArray}) => {
                console.log('0x88获取到的数据', dataArray);
            }
        }
    }

    openWater({open, duration}) {
        return this.action['0x82']({open, duration});
    }


    sendFindDeviceProtocol() {
        if (this.getDeviceIsBind()) {
            this.action['0x08']();
        }
    }

    /**
     * 发送定时闹钟
     */
    sendAlertTime({singleAlertData}) {
        if (this.getDeviceIsBind()) {
            return this.action['0x30']({singleAlertData: [...singleAlertData]});
        } else {
            return Promise.reject();
        }
    }
};
