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
            flexStart: true,
            img: '',
            buttonText: '重试',
            failedDescription: [
                {content: '手机未开启蓝牙'},
                {content: '手机未授权微信获取定位权限'},
                {content: '设备离手机太远'},
            ]
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
        setTimeout(() => {
            this.setData({
                stateObj: state()['connecting']
            })
        }, 1500)
    },


});
