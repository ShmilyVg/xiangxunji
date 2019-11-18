export function getWelcomeTime() {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 0 && hours < 5) {
        return '夜深了';
    } else if (hours < 8) {
        return '早上好';
    } else if (hours < 12) {
        return '上午好';
    } else if (hours < 18) {
        return '下午好';
    } else if (hours <= 23) {
        return '晚上好';
    }
}

export function getWelcomeContent() {
    const contents = [
        {content: '多为人间琐碎事，不解疑团迷红尘'},
        {content: '祝福自己：愿我摆脱所有纷杂的想法'},
        {content: '露凝深浅烟中泪，日汎温柔雨后香'},
        {content: '我去宇宙了，回来摘星星给你'},
        {content: '昨夜雨疏风骤。浓睡不消残酒'},
        {content: '再这样失眠下去，我就搬去月亮那住'},
        {content: '为惜影相伴，通宵不灭灯'},
        {content: '天亮后，一切便会很美的'},
        {content: '醉后不知天在水，满船清梦压星河'},
        {content: '山中何事？松花酿酒，春水煎茶'},
        {content: '拜华星之坠几，约明月之浮槎'},
        {content: '今宵绝胜无人共，卧看星河尽意明'},
        {content: '上天知我忆其人，使向人间梦中见'},
        {content: '梨花雪后酴醾雪，人在重帘浅梦中'},
        {content: '当波浪意识到自己是水，生死便不再是伤害'},
        {content: '对见解的执著，是精神之道上的最大障碍'},
        {content: '我们娴熟于为生活作准备，却并不擅长于生活'},
    ];
    return contents[Math.floor(Math.random() * contents.length)].content;
}


export function getMindPractiseList() {
    return [
        {id: 1, iconName: 'ru_shui_cui_mian', title: '入睡催眠'},
        {id: 2, iconName: 'zhu_mian_ming_xiang', title: '助眠冥想'},
        {id: 3, iconName: 'xiao_qi_chong_dian', title: '小憩充电'},
        {id: 4, iconName: 'jian_ya_jing_xin', title: '减压静心'},
    ];
}

export function getWhiteNoiseList() {
    return [
        {id: 101, iconName: 'yu_da_ba_jiao', title: '雨打芭蕉'},
        {id: 102, iconName: 'hai_bian_man_bu', title: '海边漫步'},
        {id: 103, iconName: 'lin_jian_niao_yu', title: '林间鸟语'},
        {id: 104, iconName: 'hong_ni_xiao_lu', title: '红泥小炉'},
        getDefaultWhiteNoiseItem()
    ];
}

export function getDefaultWhiteNoiseItem() {
    return {id: 100, iconName: 'zhi_ting_ren_sheng', title: '只听人声'}
}

export const getDefaultMindId = 0;
export const getDefaultWhiteNoiseId = getDefaultWhiteNoiseItem().id;

export function findVoiceTypeObjectById({voiceId}) {
    const targetMindVoice = getMindPractiseList().find(item => item.id === voiceId);
    if (targetMindVoice) {
        return {mindVoiceId: targetMindVoice.id};
    } else {
        const targetWhiteNoiseVoice = getWhiteNoiseList().find(item => item.id === voiceId);
        if (targetWhiteNoiseVoice) {
            return {noiseVoiceId: targetWhiteNoiseVoice.id};
        }
    }
    return {};
}


export function getWhiteNoiseListAtIndexPage() {
    const list = getWhiteNoiseList();
    list.pop();
    return list;
}

export function getAllVoiceList() {
    return getMindPractiseList().concat(getWhiteNoiseList());
}


// export function getPlayVoiceArgumentsById(...voiceIds) {
//     for (let voiceId of voiceIds) {
//         const mindItem = getMindPractiseList()
//     }
//     getMindPractiseList();
// }
//
// getPlayVoiceArgumentsById(1, 2);
