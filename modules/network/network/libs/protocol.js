import Network from "./network";

export default class CommonProtocol {
    static getNetworkType() {
        return new Promise((resolve, reject) => {
            wx.getNetworkType({
                success: resolve,
                fail: reject
            });
        });

    }

    static downloadFile({url}) {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url, //仅为示例，并非真实的资源
                success: (res) => {
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    if (res.statusCode === 200) {
                        resolve({tempFilePath: res.tempFilePath});
                    } else {
                        reject();
                    }
                }, fail: reject
            });
        });
    }

    static checkHaveNetwork() {
        return this.getNetworkType().then(res => {
            console.log('当前网络状态', res);
            const {networkType} = res;
            if (networkType === 'none' || networkType === 'unknown') {
                return Promise.reject(res);
            } else {
                return Promise.resolve(res);
            }
        })
    }

    static getAccountInfo() {
        return Network.request({url: 'account/info'});
    }

    static getDeviceBindInfo() {
        return Network.request({url: 'device/bind/info'})
    }

    static postDeviceBind({deviceId, mac}) {
        return Network.request({url: 'device/bind', data: {deviceId, mac}});
    }

    static postDeviceUnbind({deviceId}) {
        return Network.request({url: 'device/unbind', data: {deviceId}});
    }

    static postBlueToothUpdate({deviceId, version}) {
        return Network.request({url: 'device/version/sync', data: {deviceId, version}});
    }

    static postSystemInfo({systemInfo, hiSoftwareVersion}) {
        // return Promise.resolve();
        return Network.request({url: 'account/systeminfo', data: {systemInfo: {...systemInfo, hiSoftwareVersion}}});
    }

    static postBluetoothCreate({data}) {
        console.log('*********************************统计上传参数：', data);
        // return Promise.resolve();
        return Network.request({url: 'bluetooth/create', data, showResendDialog: false});
    }
}
