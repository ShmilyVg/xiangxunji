import {Toast} from "heheda-common-view";

export function isTreble({waterDuration = 0, betweenDuration = 0}) {
    if (waterDuration >= (betweenDuration * 3)) {
        return Promise.resolve();
    }
    Toast.showText('喷雾时间需≥3倍间隔时间');
    return Promise.reject('喷雾时间需≥3倍间隔时间');
}
