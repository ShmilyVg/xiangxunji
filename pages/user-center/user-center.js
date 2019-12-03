// pages/user-center/user-center.js
import HiNavigator from "../../navigator/hi-navigator";
import {SoftwareVersion} from "../../utils/config";
import UserInfo from "../../modules/network/network/libs/userInfo";

const App = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        SoftwareVersion,
        connectState: ''
    },

    reconnectEvent() {
        App.getBLEManager().connect();
    },
    async onLoad(options) {
        App.onAppBLEConnectStateChangedListener = ({connectState}) => {
            this.updateConnectStateView({connectState});
        };
        this.setData({...await UserInfo.get()});
    },
    toMyDeviceSettingPage() {
        HiNavigator.navigateToDeviceSetting();
    },
    toFeedbackPage() {
        HiNavigator.navigateToFeedbackPage();
    },

    updateConnectStateView({connectState}) {
        this.setData({connectState});
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.updateConnectStateView({connectState: App.getBLEManager().getBLELatestConnectState()});
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

});
