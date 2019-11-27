export default class XXJBLEConfig {
    constructor() {
        this.light = {};
        this.water = {};
        this.waterAlert = {};
        this.isAllStateReceive = false;
    }

    setWater({openStatus, hDuration, mDuration, mBetweenDuration, sBetweenDuration, speed}) {
        filterProtocolData(this.water, arguments[0]);
        console.log('设置water', this.water);
    }


    setLight({autoLight, brightness, lightOpen, red, green, blue, hDuration, mDuration}) {
        filterProtocolData(this.light, arguments[0]);
        const {red: myRed, green: myGreen, blue: myBlue} = this.light;
        this.light.currentColor = getColorByRGB({red:myRed, green: myGreen, blue: myBlue});
        console.log('设置灯光', this.light);
    }

    getLightRGB() {
        const {red, green, blue} = this.water;
        return getColorByRGB({red, green, blue});
    }
}

export function getRGBByColor({color}) {
    const [red, green, blue] = color.slice(4, -1).split(',').map(item => parseInt(item));
    return [red, green, blue];
}

function getColorByRGB({red, green, blue}) {
    return `rgb(${red},${green},${blue})`;
}

function filterProtocolData(target, {...args}) {
    const arg = arguments[1], obj = {};
    for (const key of Object.keys(arg)) {
        const value = arg[key];
        if (value !== undefined && value !== 255) {
            obj[key] = value;
        }
    }
    Object.assign(target, obj);
}
