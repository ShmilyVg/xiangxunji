import AbstractBlueTooth from "./abstract-bluetooth";

export default class BaseBlueTooth extends AbstractBlueTooth {
    constructor() {
        super();
        this._listener = null;
        this._deviceId = '';
        this._serviceId = '';
        this._characteristicId = '';
    }

    init() {
        this._deviceId = this.getConnectedDeviceId();
        setTimeout(() => {
            this.isBugPhone = getApp().globalData.systemInfo.isBugPhone;
        });
    }

    /**
     * 在连接前，一定要先设置BLE监听
     * @param listener  listener中的参数包括了 {connectState:'',protocolState:'',value:{}}
     */
    setBLEListener({listener}) {
        this._listener = listener;
    }

    updateBLEConnectState({state}) {
        this._listener({connectState: state});
    }

    async createBLEConnection({deviceId}) {
        try {
            const {serviceId, characteristicId} = await super.createBLEConnection({
                deviceId,
                valueChangeListener: this._listener
            });
            this._serviceId = serviceId;
            this._characteristicId = characteristicId;
            this.setDeviceId({deviceId});
            await super.stopBlueToothDevicesDiscovery();
            return Promise.resolve();
        } catch (e) {
            switch (e.errCode) {
                case -1:
                    console.log('已连接上，无需重新连接');
                    await super.stopBlueToothDevicesDiscovery();
                    return Promise.resolve();
                case 10003:
                case 10012:
                    console.log('连接不上，现重启蓝牙适配器');
                    await super.closeAdapter();
                    await super.openAdapter();
                    console.log('重试连接');
                    return await this.createBLEConnection({deviceId});
                default:
                    console.warn('连接失败，重新连接', e);
                    return await this.createBLEConnection({deviceId});
            }

        }
    }

    async sendData({buffer}) {
        return super.sendData({
            buffer,
            deviceId: this._deviceId,
            serviceId: this._serviceId,
            characteristicId: this._characteristicId
        });
    }

    /**
     * 获取连接过的设备id
     * @returns {string|*}
     */
    getConnectedDeviceId() {
        return this._deviceId || wx.getStorageSync('deviceId') || '';
    }

    setDeviceId({deviceId}) {
        try {
            wx.setStorageSync('deviceId', this._deviceId = deviceId);
        } catch (e) {
            console.log('setDeviceMacAddress()出现错误 deviceId=', this._deviceId);
            wx.setStorageSync('deviceId', this._deviceId = deviceId);
            console.log('setDeviceMacAddress()重新存储成功');
        }
    }

}
