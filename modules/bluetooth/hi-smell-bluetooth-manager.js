import HiSmellBlueToothProtocol from "./hi-smell-bluetooth-protocol";
import HiBlueToothManager from "./heheda-bluetooth/hi-bluetooth-manager";
import {WXDialog} from "heheda-common-view";

export default class HiSmellBlueToothManager extends HiBlueToothManager {
    constructor() {
        super();
        this.bluetoothProtocol = new HiSmellBlueToothProtocol(this);
        // this.setUUIDs({services: ['6E400001-B5A3-F393-E0A9-E50E24DCCA9F']});//设置主Services方式如 this.setUUIDs({services: ['xxxx']})  xxxx为UUID全称，可设置多个
        this.setUUIDs({
            services: ['0000180A-0000-1000-8000-00805F9B34FB'],
            hiServiceUUID: '6E400001-B5A3-F393-E0A9-E50E24DCCA9F',
            hiDeviceName:'PB1-'
        });//设置主Services方式如 this.setUUIDs({services: ['xxxx']})  xxxx为UUID全称，可设置多个
    }

    sendAlertTimeOperationProtocol({singleAlertData}) {
        return this.bluetoothProtocol.sendAlertTime({singleAlertData});
    }

    sendQueryDataSuccessProtocol({isSuccess}) {
        this.bluetoothProtocol.sendQueryDataSuccessProtocol(arguments[0]);
    }

    sendFindDeviceProtocol() {
        this.bluetoothProtocol.sendFindDeviceProtocol();
    }

    checkLocationPermission() {
        let isShowDialog = false;
        (this.checkLocationPermission = ({cb} = {}) => {
            try {
                if (!isShowDialog) {
                    isShowDialog = true;
                    const systemInfo = wx.getSystemInfoSync();
                    if (systemInfo) {
                        const {locationAuthorized, locationEnabled, system,platform} = systemInfo;
                        if (platform!=='ios') {
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