const DIVIDE_NUM = 70, contentList = [
    {content: '我是最开始的'},
    {content: '我的体重怎么也降不下来'},
    {content: '太痛苦了，我不想运动'},
    {content: '今天我好累啊，我应该吃点这个'},
    {content: '我不能拒绝这些食物'},
    {content: '我今天难受，吃东西能让我得到安慰'},
    {content: '反正我已经吃了本不该吃的东西'},
    {content: '我只吃这一次没有关系'},
    {content: '我是最后的'},
], scaleList = [
    {scaleValue: 0, opacity: 0,},
    {scaleValue: 0.4, opacity: 0.2},
    {scaleValue: 0.6, opacity: 0.3},
    {scaleValue: 0.8, opacity: 0.6},
    {scaleValue: 1, opacity: 1},
    {scaleValue: 0.8, opacity: 0.6},
    {scaleValue: 0.6, opacity: 0.3},
    {scaleValue: 0.4, opacity: 0.2},
    {scaleValue: 0, opacity: 0},
], translateList = scaleList.map((item, index) => {
    return {...item, translateYValue: DIVIDE_NUM * index};
});
const MAX_Y = parseInt(translateList[translateList.length - 1].translateYValue);

function getNextUpdateList({list}) {
    const {length} = list, middleIndex = Math.floor(length / 2);
    return list.map((item) => {
        let y = item.translateYValue + DIVIDE_NUM;
        if (y > MAX_Y) {
            y = 0;
        }
        return {...item, translateYValue: y};
    }).sort(function (item1, item2) {
        return item1.translateYValue - item2.translateYValue;
    }).map((item, index) => {
        return {
            ...item,
            ...scaleList[index],
            color: middleIndex === index ? '#ED6F69' : '#7D7D7D'
        };
    })
}


Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        list: getNextUpdateList({
            list: contentList.map((item, index) => {
                return {...item, ...translateList[index]};
            })})
    },
    pageLifetimes: {
        show() {

        },
        hide() {

        }
    },
    lifetimes: {
        created() {


        },
        attached() {

            setInterval(() => {
                this.setData({
                    list: getNextUpdateList({list: this.data.list})
                });
            }, 2000);
        },

    },
    /**
     * 组件的方法列表
     */
    methods: {

    }
});
