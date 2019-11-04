import HiSmellBlueToothProtocol from "./hi-smell-bluetooth-protocol";
import {LBlueToothManager} from "./lb-ble-common-connection/index";
import {WXDialog} from "heheda-common-view";

export default class HiSmellBlueToothManager extends LBlueToothManager {
    constructor() {
        super();
        this.bluetoothProtocol = new HiSmellBlueToothProtocol(this);
        super.setFilter({
            services: ['00006666-0000-1000-8000-00805F9B34FB'],
            targetServiceUUID: '00006666-0000-1000-8000-00805F9B34FB',
            targetDeviceName: 'Hi+aNiceSleep'
        });

        // super.setFilter({
        //     services: ['0000180A-0000-1000-8000-00805F9B34FB'],
        //     targetServiceUUID: '6E400001-B5A3-F393-E0A9-E50E24DCCA9F',
        //     targetDeviceName: 'PB1-'
        // });
    }

    getProtocol() {
        return this.bluetoothProtocol;
    }

    checkLocationPermission() {
        let isShowDialog = false;
        (this.checkLocationPermission = ({cb} = {}) => {
            try {
                if (!isShowDialog) {
                    isShowDialog = true;
                    const systemInfo = wx.getSystemInfoSync();
                    if (systemInfo) {
                        const {locationAuthorized, locationEnabled, system, platform} = systemInfo;
                        if (platform !== 'ios') {
                            if (!locationEnabled) {
                                WXDialog.showDialog({
                                    title: '小贴士', content: '请开启手机GPS', confirmText: '我知道了', confirmEvent: () => {
                                        isShowDialog = false;
                                    }
                                });
                                return;
                            } else if (!locationAuthorized) {
                                let content = '请先前往手机系统【设置】->【应用管理】->【微信】->【权限管理】->将"定位"勾选';
                                if (system.indexOf('iOS') !== -1) {
                                    content = '请先前往手机系统【设置】->【微信】->【位置】->选择"使用期间"';
                                }
                                WXDialog.showDialog({
                                    title: '小贴士', content, confirmText: '我知道了', confirmEvent: () => {
                                        isShowDialog = false;
                                    }
                                });
                                return;
                            }
                        }

                    }
                }
                cb && cb();
            } catch (e) {
                cb && cb();
                console.error(e);
            }
        })();
    }
}
