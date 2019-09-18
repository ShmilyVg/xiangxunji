// pages/connect-device/connect-device.js
function state() {
    return {
        ready: {
            title: '欢迎您使用Hi助眠',
            img: 'ready',
            buttonText: '点击绑定设备'
        },
        connecting: {
            title: '将设备开机 并靠近手机',
            subtitle: '正在寻找Hi+设备',
            img: 'connecting',
            buttonText: ''
        },
        success: {
            title: '设备找到啦！',
            img: 'success',
            buttonText: ''
        },
        failed: {
            title: '出了点小问题\n需要您检查再试试',
            img: '',
            buttonText: '重试'
        },
    }
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        stateObj: state()['ready']
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        setTimeout(()=>{
            this.setData({
                stateObj: state()['connecting']
            })
        },3000)
    },



});
