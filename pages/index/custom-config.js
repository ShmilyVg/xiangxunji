export function getDefaultSceneConfigById({voiceId}) {
    return {
        1: {
            voice: {volume: 0.4,},
            water: {openStatus: 1, hDuration: 1, mDuration: 0, mBetweenDuration: 0, sBetweenDuration: 0, speed: 0},
            light: {lightOpen: true, red: 168, green: 62, blue: 56, brightness: 50,},
        },
        2: {
            voice: {volume: 0.5,},
            water: {openStatus: 1, hDuration: 1, mDuration: 0, mBetweenDuration: 0, sBetweenDuration: 0, speed: 0},
            light: {lightOpen: true, red: 194, green: 94, blue: 71, brightness: 50,},
        },
        3: {
            voice: {volume: 0.5,},
            water: {openStatus: 1, hDuration: 1, mDuration: 0, mBetweenDuration: 0, sBetweenDuration: 0, speed: 0},
            light: {lightOpen: true, red: 200, green: 160, blue: 60, brightness: 50,},
        },
        4: {
            voice: {volume: 0.5,},
            water: {openStatus: 1, hDuration: 1, mDuration: 0, mBetweenDuration: 0, sBetweenDuration: 0, speed: 0},
            light: {lightOpen: true, red: 167, green: 205, blue: 226, brightness: 50,},
        },
        101: {
            water: {openStatus: 1, hDuration: 1, mDuration: 0, mBetweenDuration: 0, sBetweenDuration: 0, speed: 0},
            light: {lightOpen: true, red: 168, green: 62, blue: 56, brightness: 50,},
        },
        102: {
            water: {openStatus: 1, hDuration: 1, mDuration: 0, mBetweenDuration: 0, sBetweenDuration: 0, speed: 0},
            light: {lightOpen: true, red: 194, green: 94, blue: 71, brightness: 50,},
        },
        103: {
            water: {openStatus: 1, hDuration: 1, mDuration: 0, mBetweenDuration: 0, sBetweenDuration: 0, speed: 0},
            light: {lightOpen: true, red: 200, green: 160, blue: 60, brightness: 50,},
        },
        104: {
            water: {openStatus: 1, hDuration: 1, mDuration: 0, mBetweenDuration: 0, sBetweenDuration: 0, speed: 0},
            light: {lightOpen: true, red: 218, green: 156, blue: 144, brightness: 50,},
        },
    }[voiceId];
}

let latestConfigVoiceId = 1;

export async function setDeviceWithDefaultSceneConfigById({voiceId}) {
    try {
        latestConfigVoiceId = voiceId || 1;
        console.log('[setDeviceWithDefaultSceneConfigById] 接收到的默认配置 latestConfigVoiceId:', latestConfigVoiceId);
        await setDeviceLightConfigWithDefaultSceneConfig();
        await setDeviceWaterConfigWithDefaultSceneConfig();
    } catch (e) {
        console.error(e);
    }
}

export async function setDeviceWaterConfigWithDefaultSceneConfig() {
    const bleProtocol = getApp().getBLEManager().getProtocol(),
        {water: {openStatus, hDuration: hWaterDuration, mDuration: mWaterDuration, mBetweenDuration, sBetweenDuration, speed},} = getDefaultSceneConfigById({voiceId: latestConfigVoiceId});
    return await bleProtocol.setWater({
        openStatus,
        hDuration: hWaterDuration,
        mDuration: mWaterDuration,
        mBetweenDuration,
        sBetweenDuration,
        speed
    });
}

export async function setDeviceLightConfigWithDefaultSceneConfig() {
    const bleProtocol = getApp().getBLEManager().getProtocol(),
        {light: {lightOpen, brightness, red, green, blue}} = getDefaultSceneConfigById({voiceId: latestConfigVoiceId}),
        duration = await AppVoiceDelegate.getVoiceDuration(), hLightDuration = Math.floor(duration / 3600),
        mLightDuration = Math.ceil(duration / 60);
    await bleProtocol.setLightOpen({lightOpen});
    return await bleProtocol.setSingleColorLight({
        brightness,
        red,
        green,
        blue,
        hDuration: hLightDuration,
        mDuration: mLightDuration
    });
}
