const App = getApp();

//自定义的NavigationBar
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {
        open: {
            type: Boolean,
            value: false
        },
        tag: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},
    lifetimes: {
        attached() {

        },

    },
    /**
     * 组件的方法列表
     */
    methods: {
        _onSwitchEvent({currentTarget: {dataset: {open, tag}}}) {
            this.triggerEvent('onSwitchClickEvent', {open, tag});
        }
    }
});
