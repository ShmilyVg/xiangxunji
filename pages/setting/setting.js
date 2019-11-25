// pages/setting/setting.js
import {Toast} from "heheda-common-view";

const App = getApp();

function isTreble({waterDuration = 0, betweenDuration = 0}) {
    if (waterDuration > (betweenDuration * 3)) {
        return Promise.resolve();
    }
    Toast.showText('喷雾时间需≥3倍间隔时间');
    return Promise.reject('喷雾时间需≥3倍间隔时间');
}

Page({

    /**
     * 页面的初始数据
     */
    data: {

        config: {
            brightness: 50,

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

            light: {
                autoLight: false,
                lightOpen: false,
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
            deviceOpen: false
        },

    },

    onSelectedColorItemEvent({currentTarget: {dataset: {color: selectedColor}}}) {
        const [red, green, blue] = selectedColor.slice(4, -1).split(',').map(item => parseInt(item));
        if (this.data.config.light.currentColor !== selectedColor) {
            const bleProtocol = App.getBLEManager().getProtocol();
            bleProtocol.setLight({isAutoLight: false, red, green, blue});
            this.setData({
                'config.light.currentColor': selectedColor
            });
        }

    },
    onLightChanged(e) {
        const {detail: {value}} = e;
        this.setData({
            'config.brightness': value
        });
    },

    async onSwitchChangeEvent({detail: {open, tag}}) {
        console.log(open, tag);
        const bleProtocol = App.getBLEManager().getProtocol(), viewObj = {};
        Toast.showLoading();
        switch (tag) {
            case 'waterOpen': {
                viewObj['config.water.waterOpen'] = open;
                await bleProtocol.setWater({openStatus: open ? 1 : 0});
            }
                break;
        }
        Toast.hiddenLoading();
        this.setData(viewObj);
    },

    reset() {
        this.setData({
            config: {
                color: '', brightness: 50, autoLight: false,
                lightOpen: false, waterOpen: true, deviceOpen: false
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const xxjConfig = App.getBLEManager().getXXJConfig(),
            {water, light} = xxjConfig, {water: {waterSpeedArray}} = this.data.config, {colorList} = this.data;

        this.setData({
            'config.water.waterOpen': !!water.openStatus,
            'config.water.waterDurationIndex': [water.hDuration, water.mDuration],
            'config.water.waterBetweenIndex': water.mBetweenDuration,
            'config.water.waterSpeedIndex': waterSpeedArray.findIndex(item => water.speed === item.value),
            'config.light.lightOpen': light.isLightOpen,
            'config.light.autoLight': light.isAutoLight,
            // 'config.light.lightOpen': light.isLightOpen,

        })
    },
    async bindPickerChange(e) {
        const {currentTarget: {dataset: {type}}, detail: {value}} = e;
        console.log('type=', type, 'value=', value);

        const bleProtocol = App.getBLEManager().getProtocol(), viewObj = {},
            config = this.data.config, that = this;
        let bleProtocolArguments = {};
        try {
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
            Toast.showLoading();
            await bleProtocol.setWater(bleProtocolArguments);
            this.setData(viewObj);
        } catch (e) {
            console.log('自定义设置出现错误 bindPickerChange', e);
        } finally {
            Toast.hiddenLoading();
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },
});
