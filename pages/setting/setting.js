// pages/setting/setting.js
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
        config: {color: '', brightness: 50, autoLight: false, lightOpen: false, waterOpen: false, deviceOpen: false}


    },
    bindPickerChange(e) {
        console.log(e);
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
        const xxjConfig = App.getBLEManager().getXXJConfig();

        this.setData({
            config: {
                waterOpen: !!xxjConfig.water.openStatus
            }
        })
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
