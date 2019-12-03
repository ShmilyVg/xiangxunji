import {Toast, WXDialog} from "heheda-common-view";
import Protocol from "../modules/network/network/libs/protocol";
import UserInfo from "../modules/network/network/libs/userInfo";
import Login from "../modules/network/network/libs/login";

export function isTreble({waterDuration = 0, betweenDuration = 0}) {
    if (waterDuration >= (betweenDuration * 3)) {
        return Promise.resolve();
    }
    Toast.showText('喷雾时间需≥3倍间隔时间');
    return Promise.reject('喷雾时间需≥3倍间隔时间');
}


export function dealRegister() {
    return new Promise(async (resolve) => {
        try {
            await Protocol.checkHaveNetwork();
            const {userInfo} = await UserInfo.get();
            const {isNeedRegister} = getApp().judgeNeedRegister({userInfo});
            if (!isNeedRegister) {
                resolve();
            } else {
                HiNavigator.navigateToWelcome();
            }
        } catch (e) {
            console.warn('进入页面失败', e);
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        }

    });
}


export function dealAuthUserInfo(e) {
    return new Promise(async (resolve, reject) => {
        try {
            const {isNeedRegister} = getApp().judgeNeedRegister();
            if (!isNeedRegister) {
                resolve();
            }
            await Protocol.checkHaveNetwork();
            try {
                const {detail: {userInfo, encryptedData, iv}} = e;
                console.log('dealAuthUserInfo 用户信息', e);
                if (!!userInfo) {
                    Toast.showLoading();
                    await Login.doRegister({encryptedData, iv});
                    const result = await UserInfo.get();
                    console.log('获取到用户信息', result);
                    resolve(result);
                } else {
                    WXDialog.showDialog({content: '因您拒绝授权，无法使用更多专业服务', showCancel: false});
                    reject();
                }
            } catch (e) {
                console.error(e);
                reject(e);
            } finally {
                Toast.hiddenLoading();
            }
        } catch (e) {
            console.error(e);
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
            reject(e);
        }
    });
}


export function getActiveArguments(argument) {
    let obj = {};
    for (const key of Object.keys(argument)) {
        !!key && (obj[key] = argument[key]);
    }
    return obj;
}
