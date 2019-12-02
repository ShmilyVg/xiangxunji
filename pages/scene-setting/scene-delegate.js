import {isTreble} from "../../utils/util";
import {getRGBByColor} from "../../modules/bluetooth/xxj-ble-config";

export class LightSettingDelegate {
    async onSwitchChangeEvent({tag, open}) {
        const bleProtocol = getApp().getBLEManager().getProtocol(), viewObj = {};
        switch (tag) {
            case 'autoLight': {
                viewObj['config.light.autoLight'] = open;
                await bleProtocol.setAutoColorLight({autoLight: open});
            }
                break;
            case 'lightOpen': {
                viewObj['config.light.lightOpen'] = open;
                await bleProtocol.setLightOpen({lightOpen: open});
            }
                break;
        }
        return {viewObj};
    }

    async onSelectedColorItemEvent({currentColor, selectedColor}) {
        const viewObj = {};
        if (currentColor !== selectedColor) {
            const bleProtocol = getApp().getBLEManager().getProtocol();
            const [red, green, blue] = getRGBByColor({color: selectedColor});
            console.log(selectedColor, red, green, blue);
            await bleProtocol.setSingleColorLight({red, green, blue});
            viewObj['config.light.currentColor'] = selectedColor;
            viewObj['config.light.autoLight'] = false;
        }
        return {viewObj};
    }

    async onLightChanged({e, autoLight}) {
        const bleProtocol = getApp().getBLEManager().getProtocol(), {detail: {value: brightness}} = e, viewObj = {};
        console.log('onLightChanged value:', brightness);
        if (autoLight) {
            await bleProtocol.setAutoColorLight({brightness, autoLight});
        } else {
            await bleProtocol.setSingleColorLight({brightness});
        }
        viewObj['config.light.brightness'] = brightness;
        return {viewObj};
    }

    async getLatestData() {
        const xxjConfig = await getApp().getBLEManager().getXXJConfig(), {light} = xxjConfig;
        return {
            'config.light.lightOpen': light.lightOpen,
            'config.light.autoLight': light.autoLight,
            'config.light.currentColor': light.currentColor,
            'config.light.brightness': light.brightness
        };

    }

    static pageDataConfig() {
        return {
            light: {
                autoLight: false,
                lightOpen: false,
                brightness: 50,
                currentColor: '',
                colorList: [
                    {color: 'rgb(243,243,243)'},
                    {color: 'rgb(168,62,56)'},
                    {color: 'rgb(194,94,71)'},
                    {color: 'rgb(200,160,60)'},
                    {color: 'rgb(110,168,109)'},
                    {color: 'rgb(167,205,226)'},
                    {color: 'rgb(118,146,197)'},
                    {color: 'rgb(140,102,169)'},

                ],
            },
        }
    }
}

export class WaterSettingDelegate {
    constructor() {
    }

    async getLatestData() {
        const xxjConfig = await getApp().getBLEManager().getXXJConfig(), {water} = xxjConfig, {water: {waterSpeedArray}} = WaterSettingDelegate.pageDataConfig();
        return {
            'config.water.waterOpen': !!water.openStatus,
            'config.water.waterDurationIndex': [water.hDuration, water.mDuration],
            'config.water.waterBetweenIndex': water.mBetweenDuration,
            'config.water.waterSpeedIndex': waterSpeedArray.findIndex(item => water.speed === item.value),
        };
    }

    async onSwitchChangeEvent({tag, open}) {
        const bleProtocol = getApp().getBLEManager().getProtocol(), viewObj = {};
        switch (tag) {
            case 'waterOpen': {
                viewObj['config.water.waterOpen'] = open;
                await bleProtocol.setWater({openStatus: open ? 1 : 0});
            }
                break;
        }
        return {viewObj};
    }

    async bindPickerChange({type, value}) {
        const bleProtocol = getApp().getBLEManager().getProtocol(), config = WaterSettingDelegate.pageDataConfig(),
            viewObj = {};
        let bleProtocolArguments = {};
        switch (type) {
            case 'waterDuration': {
                const [hDurationIndex, mDurationIndex] = value, {water: {waterDurationArray, waterBetweenArray, waterBetweenIndex}} = config,
                    mBetweenDuration = waterBetweenArray[waterBetweenIndex].value;
                await isTreble({
                    waterDuration: waterDurationArray[0][hDurationIndex].value * 60 + waterDurationArray[1][mDurationIndex].value,
                    betweenDuration: mBetweenDuration
                });
                bleProtocolArguments = {
                    hDuration: waterDurationArray[0][hDurationIndex].value,
                    mDuration: waterDurationArray[1][mDurationIndex].value
                };
                viewObj['config.water.waterDurationIndex'] = [hDurationIndex, mDurationIndex]
            }
                break;
            case 'waterBetween': {
                const {water: {waterBetweenArray, waterDurationArray, waterDurationIndex: [hDurationIndex, mDurationIndex]}} = config,
                    mBetweenDuration = waterBetweenArray[value].value;
                await isTreble({
                    waterDuration: waterDurationArray[0][hDurationIndex].value * 60 + waterDurationArray[1][mDurationIndex].value,
                    betweenDuration: mBetweenDuration
                });
                bleProtocolArguments = {mBetweenDuration};
                viewObj['config.water.waterBetweenIndex'] = value;
            }
                break;

            case 'waterSpeed': {
                const {water: {waterSpeedArray}} = config, speed = waterSpeedArray[value].value;
                bleProtocolArguments = {speed};
                viewObj['config.water.waterSpeedIndex'] = waterSpeedArray.findIndex(item => speed === item.value);
            }
                break;

        }
        await bleProtocol.setWater(bleProtocolArguments);
        return {viewObj};
    }

    static pageDataConfig() {
        return {
            water: {
                waterOpen: false,
                waterDurationIndex: [0, 0],
                waterDurationArray: [
                    new Array(12).fill(0).map((item, index) => ({
                        content: index + '时', value: index
                    })),
                    new Array(60).fill(0).map((item, index) => ({
                        content: index + '分钟', value: index
                    }))],
                waterBetweenIndex: 0,
                waterBetweenArray: new Array(61).fill(0).map((item, index) => ({content: index + '分钟', value: index})),
                waterSpeedIndex: 0,
                waterSpeedArray: [{content: '快', value: 1}, {content: '慢', value: 0}]
            },
        }
    }


}

/**
 * 定时设置
 */
export class TimeSettingDelegate {

    async getLatestData() {
        const xxjConfig = await getApp().getBLEManager().getXXJConfig(),
            {
                waterAlert: {open: waterAlertOpen, hStartTime, mStartTime, repeatEveryDay: waterRepeatEveryDay},
                musicAlert: {open: musicAlertOpen, musicAlertId, repeatEveryDay: musicRepeatEveryDay}
            } = xxjConfig,
            {time: {wakeUpToneArray}} = TimeSettingDelegate.pageDataConfig(),
            originMusicIdInWakeUpToneArray = xxjConfig.getOriginMusicId({
                musicAlertId,
                repeatEveryDay: musicRepeatEveryDay
            });
        return {
            'config.time.waterOpenWhenOpenDevice': waterAlertOpen,
            'config.time.waterStartTimeIndex': [hStartTime, mStartTime],
            'config.time.wakeUpToneOpenWhenOpenDevice': musicAlertOpen,
            'config.time.wakeUpToneIndex': wakeUpToneArray.findIndex(item => originMusicIdInWakeUpToneArray === item.value),
            'config.time.timeRepeatEveryDay': waterRepeatEveryDay || musicRepeatEveryDay,
        };
    }

    async onSwitchChangeEvent({tag, open, repeatEveryDay}) {
        const bleProtocol = getApp().getBLEManager().getProtocol(), viewObj = {},
            xxjConfig = await getApp().getBLEManager().getXXJConfig();
        switch (tag) {
            case 'waterOpenWhenOpenDevice': {
                await bleProtocol.setWaterAlert({
                    openStatus: xxjConfig.getWaterAlertOpenStatus({
                        open,
                        repeatEveryDay
                    })
                });
                viewObj['config.time.waterOpenWhenOpenDevice'] = open;
            }
                break;

            case 'wakeUpToneOpenWhenOpenDevice': {
                const {musicAlert: {musicAlertId}} = xxjConfig;
                await bleProtocol.setMusicAlert({
                    openStatus: xxjConfig.getMusicAlertOpenStatus({
                        open,
                        musicAlertId,
                        repeatEveryDay
                    })
                });
                viewObj['config.time.wakeUpToneOpenWhenOpenDevice'] = open;
            }
                break;

            case 'timeRepeatEveryDay': {
                const {waterAlert: {open: waterAlertOpen}, musicAlert: {open: musicAlertOpen, musicAlertId}} = xxjConfig,
                    repeatEveryDay = open;
                await bleProtocol.setWaterAlert({
                    openStatus: xxjConfig.getWaterAlertOpenStatus({
                        open: waterAlertOpen,
                        repeatEveryDay
                    })
                });
                await bleProtocol.setMusicAlert({
                    openStatus: xxjConfig.getMusicAlertOpenStatus({
                        open: musicAlertOpen,
                        musicAlertId,
                        repeatEveryDay
                    })
                });
                viewObj['config.time.timeRepeatEveryDay'] = open;
            }
                break;
        }
        return {viewObj};
    }

    async bindPickerChange({type, value, repeatEveryDay}) {
        const bleProtocol = getApp().getBLEManager().getProtocol(), config = TimeSettingDelegate.pageDataConfig(),
            viewObj = {};
        switch (type) {
            case 'waterStartTime': {
                const [hStartTimeIndex, mStartTimeIndex] = value, {time: {waterStartTimeArray}} = config;
                await bleProtocol.setWaterAlert({
                    hStartTime: waterStartTimeArray[0][hStartTimeIndex].value,
                    mStartTime: waterStartTimeArray[1][mStartTimeIndex].value
                });
                viewObj['config.time.waterStartTimeIndex'] = [hStartTimeIndex, mStartTimeIndex];
            }
                break;
            case 'wakeUpTone': {
                const xxjConfig = await getApp().getBLEManager().getXXJConfig(), {musicAlert: {open}} = xxjConfig, {time: {wakeUpToneArray}} = config,
                    musicAlertId = wakeUpToneArray[value].value;
                await bleProtocol.setMusicAlert({
                    openStatus: xxjConfig.getMusicAlertOpenStatus({
                        open, musicAlertId,
                        repeatEveryDay
                    })
                });
                viewObj['config.time.wakeUpToneIndex'] = value;
            }
                break;

        }
        return {viewObj};
    }

    static pageDataConfig() {
        return {
            time: {
                waterOpenWhenOpenDevice: false,
                waterStartTimeIndex: [0, 0],
                waterStartTimeArray: [
                    new Array(24).fill(0).map((item, index) => ({
                        content: index + '时', value: index
                    })),
                    new Array(60).fill(0).map((item, index) => ({
                        content: index + '分', value: index
                    }))],
                wakeUpToneOpenWhenOpenDevice: false,
                wakeUpToneIndex: 0,
                wakeUpToneArray: [
                    {content: 'Josh Leake - A Quiet Departure', value: 1},
                    {content: 'SMOOTH J - 今日もどこかで', value: 2},
                    {content: 'SR - Daybreak', value: 3},
                    {content: 'みかん箱 - ひやむぎ、そーめん、时々うどん', value: 4}],
                timeRepeatEveryDay: false,
            },
        }
    }
}
