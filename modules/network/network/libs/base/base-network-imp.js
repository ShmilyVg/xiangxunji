import {WXDialog} from "heheda-common-view";
import {NetworkConfig} from "../config";

let _token = '', _queue = {}, divideTimestamp = 0;
export default class BaseNetworkImp {

    static setToken({token}) {
        _token = token;
    }

    static request({url, data, requestWithoutLogin = false, showResendDialog}) {
        console.log('请求协议', url, data);
        return new Promise(function (resolve, reject) {
            const requestObj = {
                url: NetworkConfig.getPostUrl() + url,
                data,
                header: {Authorization: '+sblel%wdtkhjlu', "Cookie": `JSESSIONID=${_token}`},
                method: 'POST',
                success: res => {
                    const {data} = res;
                    if (!!data && 1 === data.code) {
                        console.log('协议正常', url, data);
                        resolve(data);
                    } else {
                        console.log('协议错误', url, res);
                        reject(res);
                    }
                },
                fail: (res) => {
                    console.log('协议错误', url, res);
                    const errMsg = res.errMsg;
                    if (showResendDialog && (errMsg.indexOf("No address associated") !== -1 || errMsg.indexOf('已断开与互联网') !== -1 || errMsg.indexOf('request:fail socket time out timeout') !== -1 || errMsg.indexOf('request:fail timeout') !== -1 || errMsg.indexOf('unknow host error') !== -1)) {
                        BaseNetworkImp.addProtocol({url, requestObj});
                        BaseNetworkImp._dealTimeout({url, requestObj});
                    } else {
                        reject(res);
                    }
                },
            };
            if (!!_token || requestWithoutLogin) {
                wx.request(requestObj);
            } else {
                BaseNetworkImp.addProtocol({url, requestObj});
            }
        });
    }

    static addProtocol({url, requestObj}) {
        console.log('协议发送失败，被加到队列中', url, requestObj);
        _queue[url] = requestObj;
    }

    static resendAll() {
        let requestObj;
        console.log('重发', _queue);
        for (let key in _queue) {
            if (_queue.hasOwnProperty(key)) {
                requestObj = _queue[key];
                requestObj.header = {Authorization: '+sblel%wdtkhjlu', "Cookie": `JSESSIONID=${_token}`};
                wx.request(requestObj);
            }
        }
        _queue = {};
    }

    static _dealTimeout({url, requestObj}) {
        _queue[url] = requestObj;
        const now = Date.now();
        if (now - divideTimestamp > 2000) {
            WXDialog.showDialog({
                content: '网络异常，请重试', showCancel: true, confirmText: '重试', confirmEvent: () => {
                    divideTimestamp = 0;
                    BaseNetworkImp.resendAll();
                }, cancelEvent: () => {
                    divideTimestamp = 0;
                    if (_queue && _queue.url) {
                        _queue.url.fail({errMsg: 'network request resend cancel'});
                        delete _queue.url;
                    }
                }
            });
        }
        divideTimestamp = now;
    }
}
