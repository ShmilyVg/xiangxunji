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


    setLight({dataArray}) {

    }

}

function filterProtocolData(target, {...args}) {
    const arg = arguments[1], obj = {};
    for (const key of Object.keys(arg)) {
        arg[key] !== 255 && (obj[key] = arg[key]);
    }
    Object.assign(target, obj);
}
