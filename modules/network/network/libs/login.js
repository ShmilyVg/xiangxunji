import BaseNetworkImp from "./base/base-network-imp";

import {WXDialog} from "heheda-common-view";

let _needRegister = false;
export default class Login {
    static doLogin() {
        return new Promise((resolve, reject) => {
                return login({resolve, reject});
            }
        );
    }

    static doRegister({userInfo, encryptedData, iv}) {
        return new Promise((resolve, reject) =>
            _needRegister ? wxLogin().then(res => {
                const {code} = res;
                return BaseNetworkImp.request({
                    url: 'account/register',
                    data: {code, encrypted_data: encryptedData, iv},
                    requestWithoutLogin: true
                })
            }).then(data => {
                setToken({data});
                BaseNetworkImp.resendAll();
                resolve();
            }).catch(res => {
                console.log('register failed:', res);
                reject(res);
            }) : resolve()
        )

    }


}

function wxReLogin(resolve, reject) {
    wx.login({
        success: resolve, fail: res => {
            WXDialog.showDialog({
                title: '糟糕', content: '抱歉，目前小程序无法登录，请稍后重试', confirmEvent: () => {
                    wxReLogin(resolve, reject);
                }
            });
            console.log('wx login failed', res);
        }
    })
}

function wxLogin() {
    return new Promise((resolve, reject) =>
        wxReLogin(resolve, reject)
    );
}

function setToken({data: {result: {jsessionid}}}) {
    BaseNetworkImp.setToken({token: jsessionid});
    wx.setStorage({
        key: 'token',
        data: jsessionid,
    });
}

const loginFailObj = {
    2: () => {
        console.log('未注册，请先注册');
        _needRegister = true;
    },
    4000: ({resolve, reject}) => {
        WXDialog.showDialog({
            title: '糟糕', content: '抱歉，目前小程序无法登录，请稍后重试', confirmEvent: () => {
                login({resolve, reject});
            }
        });
    }
};

function login({resolve, reject}) {
    return wxLogin().then(resolve, reject);
}

// function login({resolve, reject}) {
//     return wxLogin().then(res => {
//             const token = wx.getStorageSync('token');
//             return BaseNetworkImp.request({
//                 url: 'account/login',
//                 data: {js_code: res.code, token},
//                 requestWithoutLogin: true
//             })
//         }
//     ).then(data => {
//         setToken({data});
//         console.log('登录成功，开始重发协议');
//         BaseNetworkImp.resendAll();
//         resolve();
//     }).catch(res => {
//         console.log('login failed', res);
//         if (res.data) {
//             const {data: {code}} = res;
//             const obj = loginFailObj[code];
//             obj && obj({resolve, reject});
//             reject(res);
//             return;
//         }
//         WXDialog.showDialog({title: '糟糕', content: '抱歉，目前小程序无法登录，请稍后重试'});
//         reject(res);
//     })
//
//
// }
