class BaseStorage {
    static set({key, data}) {
        return new Promise((resolve, reject) => {
            wx.setStorage({key, data, success: resolve, fail: reject});
        });
    }

    static get(key) {
        return new Promise((resolve, reject) => {
            wx.getStorage({key, success: resolve, fail: reject});
        });
    }

    static setSync({key, data}) {
        wx.setStorageSync(key, data);
    }

    static getSync(key) {
        return wx.getStorageSync(key);
    }

}

export default class Storage extends BaseStorage {
    static async setSetting({isLightOpen, isWaterOpen}) {
        return await this.set({key: 'custom_setting', data: arguments[0]});
    }

    static async getSetting() {
        return await this.get('custom_setting');
    }

    static async setLightOpen({open}) {
        return await this.set({key: 'light_open_setting', data: open});
    }

    static async getLightOpen() {
        return (await this.get('light_open_setting')).data;
    }

    static async setWaterOpen({open}) {
        return await this.set({key: 'water_open_setting', data: open});
    }

    static async getWaterOpen() {
        return (await this.get('water_open_setting')).data;
    }
}

