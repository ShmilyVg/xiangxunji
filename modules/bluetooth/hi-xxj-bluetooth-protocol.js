import {LBlueToothProtocolOperator} from "./lb-ble-common-protocol-operator/index";
import {ReceiveBody, SendBody} from "./lb-ble-xiangxunji-protocol-body/index";
import {HexTools} from "./lb-ble-common-tool/index";
import XXJBLEConfig from "./xxj-ble-config";
import {XXJProtocolState} from "./bluetooth-state";

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
             * 0x11：单色灯设置（写）
             * @param brightness  灯亮度 0x00 - 0xff
             * @param red 0x00 - 0xff
             * @param green 0x00 - 0xff
             * @param blue 0x00 - 0xff
             * @param lightOpen 现在是通过计算hDuration和mDuration的值来处理
             * @param hDuration 0x00:0h 0x01:1h ... 0x0C:12h 0xff:不设置
             * @param mDuration 0x00:0分钟 0x01:1分钟 ... 0x3B:59分钟 0xff:不设置
             */
            '0x11': async ({brightness = this.xxjBLEConfig.light.brightness, red = this.xxjBLEConfig.light.red, green = this.xxjBLEConfig.light.green, blue = this.xxjBLEConfig.light.blue, lightOpen = this.xxjBLEConfig.light.lightOpen, hDuration = 255, mDuration = 255}) => {
                console.log('0x11 brightness', brightness, ' red=', red, ' green=', green, ' blue=', blue, ' lightOpen=', lightOpen, ' hDuration=', hDuration, ' mDuration=', mDuration);
                // await this.setAutoColorLight({brightness, autoLight: false});
                const result = await this.sendData({
                    command: '0x11',
                    data: [brightness / 100 * 255, red, green, blue, hDuration, mDuration]
                });
                this.xxjBLEConfig.setLight({autoLight: false, brightness, red, green, blue, hDuration, mDuration});
                return result;
            },

            /**
             * 0x12：七彩灯设置（写）
             * @param brightness 灯亮度 0~100 含义是0到100%
             * @param autoLight 七彩灯光开关
             * @returns {Promise<void>}
             */
            '0x12': async ({brightness = this.xxjBLEConfig.light.brightness, autoLight = this.xxjBLEConfig.light.autoLight}) => {
                console.log('0x12 brightness', brightness);
                const result = await this.sendData({
                    command: '0x12',
                    data: [brightness / 100 * 255, Number(autoLight)]
                });
                this.xxjBLEConfig.setLight({autoLight, brightness});
                return result;
            },
            /**
             * 灯光开关
             * @param lightOpen Boolean
             * @returns {Promise<void>}
             */
            '0x52': async ({lightOpen = this.xxjBLEConfig.light.lightOpen}) => {
                console.log('0x52 lightOpen', lightOpen);
                const result = await this.sendData({
                    command: '0x52',
                    data: [Number(lightOpen)]
                });
                this.xxjBLEConfig.setLight({lightOpen});
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
                console.log('0x53 openStatus', openStatus, ' hDuration=', hDuration, ' mDuration=', mDuration, ' mBetweenDuration=',
                    mBetweenDuration, ' sBetweenDuration=', sBetweenDuration, ' speed=', speed);
                const result = await this.sendData({
                    command: '0x53',
                    data: [openStatus, hDuration, mDuration, mBetweenDuration, sBetweenDuration, speed]
                });
                this.xxjBLEConfig.setWater({
                    openStatus,
                    hDuration,
                    mDuration,
                    mBetweenDuration,
                    sBetweenDuration,
                    speed
                });
                return result;

            },

            /**
             * 雾化定时设置（写）
             * @param openStatus 0x00:关 0x01:雾化开 0x11:每天重复开雾 0xff:不设置
             * @param hStartTime 0x00-0x17 0xff:不设置
             * @param mStartTime 0x00-0x3B 0xff:不设置
             */
            '0x54': async ({openStatus = 255, hStartTime = 255, mStartTime = 255}) => {
                const result = await this.sendData({
                    command: '0x54',
                    data: [openStatus, hStartTime, mStartTime, 255, 255, 255]
                });
                this.xxjBLEConfig.setWaterAlert({
                    open: !!openStatus,
                    repeatEveryDay: openStatus === 17, hStartTime, mStartTime
                });
                return result;
            },

            /**
             * 音乐定时设置（写）
             * @param openStatus 0x00:关 0x01:定时音乐1开 0x11:每天重复音乐1 0x12:每天重复音乐2 ... 0xff:不设置
             * @param repeatCount 0x01:只播放1次 0x02:循环播放2次 0x03:循环播放3次 ... 0xff:不设置
             * @param hStartTime 0x00-0x17 0xff:不设置
             * @param mStartTime 0x00-0x3B 0xff:不设置
             * @param volume 0x00-0x06 0xff:不设置
             */
            '0x55': async ({openStatus = 255, repeatCount = 1, hStartTime = 255, mStartTime = 255, volume = 255}) => {
                const result = await this.sendData({
                    command: '0x55',
                    data: [openStatus, repeatCount, hStartTime, mStartTime, volume, 255]
                });

                this.xxjBLEConfig.setMusicAlert({
                    open: !!openStatus,
                    musicAlertId: openStatus, repeatCount, hStartTime, mStartTime, volume
                })
                return result;
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
             * 灯开关设置（读）
             */
            '0x60': ({dataArray}) => {
                console.log('接收到的0x60的数据 从byte2开始', dataArray);
                const [lightOpen] = dataArray;
                this.xxjBLEConfig.setLight({lightOpen});
            },
            /**
             * 单色灯设置（读）
             */
            '0x61': ({dataArray}) => {
                console.log('接收到的0x61的数据 从byte2开始', dataArray);
                const [brightness, red, green, blue, hDuration, mDuration] = dataArray;
                this.xxjBLEConfig.setLight({
                    brightness: brightness / 255 * 100,
                    red,
                    green,
                    blue,
                    hDuration,
                    mDuration
                });
            },
            /**
             * 七彩灯设置
             * @param dataArray
             */
            '0x62': ({dataArray}) => {
                console.log('接收到的0x62的数据 从byte2开始', dataArray);
                const [brightness, autoLight] = dataArray;
                this.xxjBLEConfig.setLight({brightness: brightness / 255 * 100, autoLight: !!autoLight});
            },
            /**
             * 雾化设置（读）
             */
            '0x63': ({dataArray}) => {
                console.log('接收到的0x63的数据 从byte2开始', dataArray);
                const [openStatus, hDuration, mDuration, mBetweenDuration, sBetweenDuration, speed] = dataArray;
                this.xxjBLEConfig.setWater({
                    openStatus,
                    hDuration,
                    mDuration,
                    mBetweenDuration,
                    sBetweenDuration,
                    speed
                });

            },
            /**
             * 雾化定时设置（读）
             */
            '0x64': ({dataArray}) => {
                console.log('接收到的0x64的数据 从byte2开始', dataArray);
                const [openStatus, hStartTime, mStartTime] = dataArray;
                this.xxjBLEConfig.setWaterAlert({
                    open: !!openStatus,
                    repeatEveryDay: openStatus === 17,
                    hStartTime,
                    mStartTime
                });
            },
            /**
             * 音乐定时设置（读）
             */
            '0x65': ({dataArray}) => {
                console.log('接收到的0x65的数据 从byte2开始', dataArray);
                const [openStatus, repeatCount, hStartTime, mStartTime, volume] = dataArray;
                this.xxjBLEConfig.setMusicAlert({
                    open: !!openStatus,
                    musicAlertId: openStatus,
                    repeatCount,
                    hStartTime,
                    mStartTime,
                    volume
                });
                this.xxjBLEConfig.isAllStateReceive = true;
                return {protocolState: XXJProtocolState.RECEIVE_ALL_STATE};
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

    setSingleColorLight = this.sendAction['0x11'];
    setAutoColorLight = this.sendAction['0x12'];
    setLightOpen = this.sendAction['0x52'];
    setWater = this.sendAction['0x53'];
    setWaterAlert = this.sendAction['0x54'];

    setMusicAlert({openStatus, repeatCount, hStartTime, mStartTime, volume}) {
        return this.sendAction['0x55'](arguments[0]);
    }

    sendDataWithInput({array}) {
        const [command, ...data] = array;
        this.sendData({command: HexTools.numToHex(command), data});
    }

    getDeviceAllStatus() {
        return this.sendAction['0x56']();
    }

};
