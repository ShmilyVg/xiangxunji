// pages/setting/setting.js
import {Toast} from "heheda-common-view";
import {getOneDayTimeArrayObj, LightSettingDelegate, WaterSettingDelegate} from "./scene-delegate";


Page({

    /**
     * 页面的初始数据
     */
    data: {

        config: {
            ...getOneDayTimeArrayObj(),
            ...WaterSettingDelegate.pageDataConfig(),
            ...LightSettingDelegate.pageDataConfig(),
        },

    },

    async onSelectedColorItemEvent({currentTarget: {dataset: {color: selectedColor}}}) {
        Toast.showLoading();
        const {viewObj: colorViewObj} = await this.lightSettingDelegate.onSelectedColorItemEvent({
            currentColor: this.data.config.light.currentColor,
            selectedColor
        });
        Toast.hiddenLoading();
        this.setData({...colorViewObj});
    },
    async onLightChanged(e) {
        this.setData({
            ...((await this.lightSettingDelegate.onLightChanged({
                e,
                autoLight: this.data.config.light.autoLight
            })).viewObj)
        });
    },

    async onSwitchChangeEvent({detail: {open, tag}}) {
        console.log(open, tag);
        Toast.showLoading();
        const {viewObj: waterViewObj} = await this.waterSettingDelegate.onSwitchChangeEvent({tag, open});
        const {viewObj: lightViewObj} = await this.lightSettingDelegate.onSwitchChangeEvent({tag, open});
        Toast.hiddenLoading();
        this.setData({...waterViewObj, ...lightViewObj});
    },

    async reset() {
        this.setData({
            ...await this.waterSettingDelegate.getResetData(),
            ...await this.lightSettingDelegate.getResetData()
        });
    },
    async onLoad(options) {
        this.waterSettingDelegate = new WaterSettingDelegate();
        this.lightSettingDelegate = new LightSettingDelegate();
        this.setData({
            ...await this.waterSettingDelegate.getLatestData(),
            ...await this.lightSettingDelegate.getLatestData(),
        });

    },
    async bindPickerChange(e) {
        const {currentTarget: {dataset: {type}}, detail: {value}} = e;
        console.log('type=', type, 'value=', value);

        try {
            Toast.showLoading();
            const {config: currentPageConfig} = this.data,
                {viewObj: waterViewObj} = await this.waterSettingDelegate.bindPickerChange({
                    type,
                    value,
                    currentPageConfig
                }),
                {viewObj: lightViewObj} = await this.lightSettingDelegate.bindPickerChange({
                    type,
                    value,
                    currentPageConfig
                });
            this.setData({...waterViewObj, ...lightViewObj});
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
