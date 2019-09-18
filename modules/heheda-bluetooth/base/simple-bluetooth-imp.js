import BaseBlueToothImp from "./base-bluetooth-imp";

export default class SimpleBlueToothImp {
    constructor() {
        this.bluetoothManager = new BaseBlueToothImp();
        this.bluetoothManager.dealReceiveData = this.dealReceiveData.bind(this);
    }

    init() {
        this.bluetoothManager.init();
    }
    /**
     * 设置蓝牙行为的监听
     * @param receiveDataListener 必须设置
     * @param bleStateListener 必须设置
     * @param scanBLEListener 不必须设置 如果没有设置该监听，则在扫描蓝牙设备后，会自动连接距离手机最近的蓝牙设备；否则，会返回扫描到的所有设备
     */
    setBLEListener({receiveDataListener, bleStateListener, scanBLEListener, bleSignPowerListener}) {
        this.bluetoothManager.setBLEListener(arguments[0]);
    }

    setUUIDs({services, hiServiceUUID,hiDeviceName}) {
        this.bluetoothManager.setUUIDs({services, hiServiceUUID, hiDeviceName});
    }

    sendData({buffer}) {
        return this.bluetoothManager.sendData({buffer});
    }

    getDeviceMacAddress() {
        return this.bluetoothManager.getDeviceMacAddress();
    }

    setBLEUpdateListener({scanBLEListener, connectionStateListener, adapterStateListener, receiveDataListener}) {
        this.bluetoothManager.setBLEUpdateListener(arguments[0]);
    }

    /**
     * 连接蓝牙
     * @returns {*}
     */
    connect({macId} = {}) {
        return this.bluetoothManager.openAdapterAndConnectLatestBLE({macId});
    }

    startScanAndConnectDevice() {
        this.bluetoothManager.resetDevices();
        return this.bluetoothManager.openAdapterAndStartBlueToothDeviceDiscovery();
    }

    getConnectDevices() {
        return this.bluetoothManager.getConnectedBlueToothDevices();
    }

    /**
     * 关闭蓝牙适配器
     * @returns {Promise<any>}
     */
    closeAll() {
        this.bluetoothManager.resetDevices();
        return this.bluetoothManager.closeAdapter();
    }

    clearConnectedBLE() {
        this.bluetoothManager.resetDevices();
        return this.bluetoothManager.clearConnectedBLE();
    }

    getState({connectState, protocolState}) {
        return this.bluetoothManager.getState(arguments[0]);
    }

    /**
     * 立即更新蓝牙设备状态
     * 调用该函数会导致立刻回调bleStateListener函数
     * @param state
     */
    updateBLEStateImmediately({state}) {
        this.bluetoothManager.updateBLEState({state});
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
