import {LBlueToothProtocolOperator} from "./lb-ble-common-protocol-operator/index";
import {ReceiveBody, SendBody} from "./lb-ble-xiangxunji-protocol-body/index";
import {HexTools} from "./lb-ble-common-tool/index";
import XXJBLEConfig from "./xxj-ble-config";

export default class HiXxjBluetoothProtocol extends LBlueToothProtocolOperator {
    constructor(blueToothManager) {
        super({blueToothManager, protocolSendBody: new SendBody(), protocolReceiveBody: new ReceiveBody()});
        this.xxjBLEConfig = new XXJBLEConfig();
    }

    getSendActionProtocol() {
        return {
            /**
             * 时间设置（写）
             * 一连接上蓝牙，先发送本地时间
             */
            '0x51': ({currentHour, currentMinute, currentSecond}) => {
                return this.sendData({
                    command: '0x51',
                    data: [currentHour, currentMinute, currentSecond, 255, 255, 255]
                });
            },
            /**
             * 灯设置（写）
             * @param autoLight isAutoColor? (0x12：七彩渐变) : (0x11：单色灯)
             * @param red 0x00 - 0xff
             * @param green 0x00 - 0xff
             * @param blue 0x00 - 0xff
             * @param lightOpen 现在是通过计算hDuration和mDuration的值来处理
             * @param hDuration 0x00:0h 0x01:1h ... 0x0C:12h 0xff:不设置
             * @param mDuration 0x00:0分钟 0x01:1分钟 ... 0x3B:59分钟 0xff:不设置
             */
            '0x52': async ({autoLight = this.xxjBLEConfig.light.autoLight, red = this.xxjBLEConfig.light.red, green = this.xxjBLEConfig.light.green, blue = this.xxjBLEConfig.light.blue, lightOpen = this.xxjBLEConfig.light.lightOpen, hDuration = 255, mDuration = 255}) => {
                console.log('0x52 autoLight', autoLight, ' red=', red, ' green=', green, ' blue=', blue, ' lightOpen=', lightOpen, ' hDuration=', hDuration, ' mDuration=', mDuration);

                const result = await this.sendData({
                    command: '0x52',
                    data: [autoLight ? 18 : 17, red, green, blue, hDuration, mDuration]
                });
                this.xxjBLEConfig.setLight({autoLight, red, green, blue, hDuration, mDuration});
                return result;
            },
            /**
             * 雾化设置（写）
             * @param openStatus 0x00:关闭 0x01:开启 0xff:不设置
             * @param hDuration 0x00:0h 0x01:1h 0x02：2h ... 0x0C:12h 0xff:不设置
             * @param mDuration 0x00:0分钟 0x01:1分钟 0x02：2分钟 ... 0x3B:59分钟 0xff:不设置
             * @param mBetweenDuration 0x00:0分钟 0x01:1分钟 0x02：2分钟 ... 0x3C:60分钟 0xff:不设置
             * @param sBetweenDuration 0x00:无间断 0x01:1秒钟 0x02：2秒钟 ... 0x3B:59秒钟 0xff:不设置
             * @param speed 0x00:小雾 0x01:大雾 0xff:不设置
             */
            '0x53': async ({openStatus = 255, hDuration = 255, mDuration = 255, mBetweenDuration = 255, sBetweenDuration = 255, speed = 255}) => {
                console.log('0x53 openStatus', openStatus,' hDuration=',hDuration,' mDuration=',mDuration,' mBetweenDuration=',mBetweenDuration,' sBetweenDuration=',sBetweenDuration,' speed=',speed);
                const result = await this.sendData({
                    command: '0x53',
                    data: [openStatus, hDuration, mDuration, mBetweenDuration, sBetweenDuration, speed]
                });
                this.xxjBLEConfig.setWater({openStatus, hDuration, mDuration, mBetweenDuration, sBetweenDuration, speed});
                return result;

            },

            /**
             * 雾化定时设置（写）
             * @param openStatus 0x00:关 0x01:雾化开 0x11:每天重复开雾 0xff:不设置
             * @param hStartTime 0x00-0x17 0xff:不设置
             * @param mStartTime 0x00-0x3B 0xff:不设置
             */
            '0x54': ({openStatus = 255, hStartTime = 255, mStartTime = 255}) => {
                return this.sendData({command: '0x54', data: [openStatus, hStartTime, mStartTime, 255, 255, 255]});
            },
            /**
             * 音乐定时设置（写）
             * @param openStatus 0x00:关 0x01:定时音乐1开 0x11:每天重复音乐1 0x12:每天重复音乐2 ... 0xff:不设置
             * @param circleCount 0x01:只播放1次 0x02:循环播放2次 0x03:循环播放3次 ... 0xff:不设置
             * @param hStartTime 0x00-0x17 0xff:不设置
             * @param mStartTime 0x00-0x3B 0xff:不设置
             * @param volume 0x00-0x06 0xff:不设置
             */
            '0x55': ({openStatus = 255, circleCount = 255, hStartTime = 255, mStartTime = 255, volume}) => {
                return this.sendData({
                    command: '0x55',
                    data: [openStatus, circleCount, hStartTime, mStartTime, volume, 255]
                });
            },
            /**
             * 读取香薰机状态（读）
             */
            '0x56': () => {
                return this.sendData({command: '0x56', data: [0, 0, 0, 0, 0, 0]});
            },
        }
    }

    getReceiveActionProtocol() {
        return {
            /**
             * 灯设置（读）
             */
            '0x62': ({dataArray}) => {
                console.log('接收到的0x62的数据 从byte2开始', dataArray);
                const [red, green, blue, hDuration, mDuration] = dataArray, isAutoLight = 18;
                this.xxjBLEConfig.setLight({isAutoLight: isAutoLight === 18, red, green, blue, hDuration, mDuration});
            },
            /**
             * 雾化设置（读）
             */
            '0x63': ({dataArray}) => {
                console.log('接收到的0x63的数据 从byte2开始', dataArray);
                const [openStatus, hDuration, mDuration, mBetweenDuration, sBetweenDuration, speed] = dataArray;
                this.xxjBLEConfig.setWater({openStatus, hDuration, mDuration, mBetweenDuration, sBetweenDuration, speed});
            },
            /**
             * 雾化定时设置（读）
             */
            '0x64': ({dataArray}) => {
                console.log('接收到的0x64的数据 从byte2开始', dataArray);
            },
            /**
             * 音乐定时设置（读）
             */
            '0x65': ({dataArray}) => {
                console.log('接收到的0x65的数据 从byte2开始', dataArray);

            },

        };
    }

    setLocalTime() {
        const date = new Date();
        return this.sendAction['0x51']({
            currentHour: date.getHours(), currentMinute: date.getMinutes(),
            currentSecond: date.getSeconds()
        });
    }

    setLight = this.sendAction['0x52'];
    setWater = this.sendAction['0x53'];

    sendDataWithInput({array}) {
        const [command, ...data] = array;
        this.sendData({command: HexTools.numToHex(command), data});
    }

    getDeviceAllStatus() {
        console.warn('我要发送获取设备状态协议');
        return this.sendAction['0x56']();
    }

};
