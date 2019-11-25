export default class XXJBLEConfig {
    constructor() {
        this.light = {};
        this.water = {};
        this.waterAlert = {};
    }

    setWater({openStatus, hDuration, mDuration, mBetweenDuration, sBetweenDuration, speed}) {
        filterProtocolData(this.water, arguments[0]);
        console.log('设置water', this.water);
    }


    setLight({isAutoLight, red, green, blue, hDuration, mDuration}) {
        filterProtocolData(this.light, arguments[0]);
        const {hDuration: currentHDuration, mDuration: currentMDuration} = this.light;
        this.light.isLightOpen = (currentHDuration + currentMDuration) !== 0;
        console.log('设置灯光', this.light);
    }

}

function filterProtocolData(target, {...args}) {
    const arg = arguments[1], obj = {};
    for (const key of Object.keys(arg)) {
        arg[key] !== 255 && (obj[key] = arg[key]);
    }
    Object.assign(target, obj);
}
