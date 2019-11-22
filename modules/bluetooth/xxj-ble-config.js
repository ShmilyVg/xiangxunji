export default class XXJBLEConfig {
    constructor() {
        this.light = null;
        this.water = null;
        this.waterAlert = null;
    }

    setWater({openStatus, hDuration, mDuration, mBetweenDuration, sBetweenDuration, speed}) {
        this.water = {...arguments[0]};
        console.log('设置water',this.water);
    }


    setLight({dataArray}) {

    }

}
