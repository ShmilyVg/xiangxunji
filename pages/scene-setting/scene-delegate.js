import {isTreble} from "../../utils/util";
import {getRGBByColor} from "../../modules/bluetooth/xxj-ble-config";

export class LightSettingDelegate {
    async onSwitchChangeEvent({tag, open}) {
        const bleProtocol = getApp().getBLEManager().getProtocol(), viewObj = {};
        switch (tag) {
            case 'autoLight': {
                viewObj['config.light.autoLight'] = open;
                await bleProtocol.setLight({autoLight: open});
            }
                break;
            case 'lightOpen': {
                viewObj['config.water.lightOpen'] = open;

                await bleProtocol.setLight({lightOpen: open});
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
            await bleProtocol.setLight({autoLight: false, red, green, blue});
            viewObj['config.light.currentColor'] = selectedColor;
            viewObj['config.light.autoLight'] = false;
        }
        return {viewObj};
    }

    async onLightChanged(e) {
        const {detail: {value}} = e, viewObj = {};
        viewObj['config.light.brightness'] = value;
        return {viewObj};
    }

    async getLatestData() {
        const xxjConfig = await getApp().getBLEManager().getXXJConfig(), {light} = xxjConfig;
        return {
            'config.light.lightOpen': light.lightOpen,
            'config.light.autoLight': light.autoLight,
            'config.light.currentColor': light.currentColor,
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

}
