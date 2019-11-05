import BaseBlueToothImp from "./base-bluetooth-imp";

export default class SimpleBlueToothImp {
    constructor() {
        this.bluetoothManager = new BaseBlueToothImp();
        this.bluetoothManager.dealReceiveData = this.dealReceiveData.bind(this);
        if (this.overwriteFindTargetDeviceForConnected) {
            this.bluetoothManager.findTargetDeviceNeedConnected = this.overwriteFindTargetDeviceForConnected;
        }
    }

    setBLEListener({listener}) {
        this.bluetoothManager.setBLEListener(arguments[0]);
    }

    setFilter({services, targetServiceUUID, targetDeviceName}) {
        this.bluetoothManager.setFilter({services, targetServiceUUID, targetDeviceName});
    }

    sendData({buffer}) {
        return this.bluetoothManager.sendData({buffer});
    }

    getDeviceMacAddress() {
        return this.bluetoothManager.getDeviceMacAddress();
    }

    /**
     * 连接蓝牙
     */
    connect() {
        this.bluetoothManager.openAdapterAndConnectLatestBLE();
    }


    getConnectDevices() {
        return this.bluetoothManager.getConnectedBlueToothDevices();
    }

    /**
     * 关闭蓝牙适配器
     * @returns {Promise<any>}
     */
    closeAll() {
        return this.bluetoothManager.closeAdapter();
    }

    clearConnectedBLE() {
        return this.bluetoothManager.clearConnectedBLE();
    }

    updateBLEConnectState({connectState}) {
        this.bluetoothManager.latestConnectState = connectState;
    }

    getBLELatestConnectState() {
        return this.bluetoothManager.latestConnectState;
    }

    executeBLEReceiveDataCallBack({protocolState, value}) {
        this.bluetoothManager.latestProtocolInfo = {protocolState, value};
    }

    /**
     * 处理从连接的蓝牙中接收到的数据
     * 该函数必须在子类中重写！
     * 也千万不要忘了在重写时给这个函数一个返回值，作为处理数据后，传递给UI层的数据
     * @param receiveBuffer 从连接的蓝牙中接收到的数据
     * @returns 传递给UI层的数据
     */
    dealReceiveData({receiveBuffer}) {

    }
};
