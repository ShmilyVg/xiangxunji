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


    setLight({autoLight, lightOpen, red, green, blue, hDuration, mDuration}) {
        filterProtocolData(this.light, arguments[0]);
        const {hDuration: currentHDuration, mDuration: currentMDuration} = this.light;
        this.light.currentColor = getColorByRGB({red, green, blue});
        this.light.lightOpen = (currentHDuration + currentMDuration) !== 0;
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
        arg[key] !== 255 && (obj[key] = arg[key]);
    }
    Object.assign(target, obj);
}
