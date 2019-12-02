import {LightSettingDelegate, TimeSettingDelegate, WaterSettingDelegate} from "../scene-setting/scene-delegate";
import {Toast} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";

Page({


    data: {
        config: {
            ...WaterSettingDelegate.pageDataConfig(),
            ...LightSettingDelegate.pageDataConfig(),
            ...TimeSettingDelegate.pageDataConfig(),
        }
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
        const {viewObj: timeViewObj} = await this.timeSettingDelegate.onSwitchChangeEvent({
            tag, open,
            repeatEveryDay: this.data.config.time.timeRepeatEveryDay
        });
        Toast.hiddenLoading();
        this.setData({...waterViewObj, ...lightViewObj, ...timeViewObj});
    },

    async onLoad(options) {
        this.waterSettingDelegate = new WaterSettingDelegate();
        this.lightSettingDelegate = new LightSettingDelegate();
        this.timeSettingDelegate = new TimeSettingDelegate();
        this.setData({
            ...await this.waterSettingDelegate.getLatestData(),
            ...await this.lightSettingDelegate.getLatestData(),
            ...await this.timeSettingDelegate.getLatestData(),
        });

    },
    async bindPickerChange(e) {
        const {currentTarget: {dataset: {type}}, detail: {value}} = e;
        console.log('type=', type, 'value=', value);
        try {
            Toast.showLoading();
            const {viewObj: waterViewObj} = await this.waterSettingDelegate.bindPickerChange({type, value});
            const {viewObj: timeViewObj} = await this.timeSettingDelegate.bindPickerChange({
                type, value,
                repeatEveryDay: this.data.config.time.timeRepeatEveryDay
            });
            this.setData({...waterViewObj, ...timeViewObj});
        } catch (e) {
            console.log('自定义设置出现错误 bindPickerChange', e);
        } finally {
            Toast.hiddenLoading();
        }

    },
    async disconnectDevice() {
        Toast.showLoading();
        await getApp().getBLEManager().closeAll();
        Toast.hiddenLoading();
        HiNavigator.navigateBack({delta: 1});
    }
});
