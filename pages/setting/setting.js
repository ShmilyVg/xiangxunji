// pages/setting/setting.js
import {Toast} from "heheda-common-view";

const App = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        config: {
            color: '',
            brightness: 50,
            autoLight: false,
            lightOpen: false,
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
                waterBetweenArray: new Array(61).fill(0).map((item, index) => ({content: index + '分钟', value: index}))
            },
            deviceOpen: false
        },

    },

    onSelectedColorItemEvent({currentTarget: {dataset: {color: selectedColor}}}) {
        if (this.data.config.color !== selectedColor) {
            this.setData({
                'config.color': selectedColor
            });
        }

    },
    onLightChanged(e) {
        const {detail: {value}} = e;
        this.setData({
            'config.brightness': value
        });
    },

    onSwitchChangeEvent({detail: {open, tag}}) {
        console.log(open, tag);

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
        const xxjConfig = App.getBLEManager().getXXJConfig(), water = xxjConfig.water;

        this.setData({
            'config.water.waterOpen': !!water.openStatus,
            'config.water.waterDurationIndex': [water.hDuration, water.mDuration],
            'config.water.waterBetweenIndex': water.mBetweenDuration
        })
    },
    async bindPickerChange(e) {
        const {currentTarget: {dataset: {type}}, detail: {value}} = e;
        console.log('type=', type, 'value=', value);

        const bleProtocol = App.getBLEManager().getProtocol(), obj = {}, config = this.data.config;
        try {
            Toast.showLoading();
            switch (type) {
                case 'waterDuration': {
                    const [hDurationIndex, mDurationIndex] = value, {water: {waterDurationArray}} = config;
                    await bleProtocol.setWater({
                        hDuration: waterDurationArray[0][hDurationIndex].value,
                        mDuration: waterDurationArray[1][mDurationIndex].value
                    });
                    obj['config.water.waterDurationIndex'] = [hDurationIndex, mDurationIndex]
                }
                    break;
                case 'waterBetween': {
                    const {water: {waterBetweenArray}} = config;
                    await bleProtocol.setWater({mBetweenDuration: waterBetweenArray[value].value});
                    obj['config.water.waterBetweenIndex'] = value;
                }
                    break;


            }
            this.setData(obj);
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
