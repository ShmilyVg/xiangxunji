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
        envVoices: {
            type: Array,
            value: []
        },
    },

    /**
     * 组件的初始数据
     */
    data: {show: false},
    lifetimes: {
        attached() {

        },

    },
    /**
     * 组件的方法列表
     */
    methods: {
        _onChooseEnvVoiceItem(e) {
            const {currentTarget: {dataset: {item: currentClickItem}}} = e;
            const obj = {}, currentItemId = currentClickItem.id,
                frontSelectedItem = this.data.envVoices.find(item => item.selected);
            if (frontSelectedItem && frontSelectedItem.id === currentItemId) {
                this._hideFun();
                return;
            }
            for (let [index, item] of this.data.envVoices.entries()) {
                obj[`envVoices[${index}].selected`] = item.id === currentItemId;
            }
            this.setData(obj, () => {
                this.triggerEvent('onChooseEnvVoiceItem', {selectedItemId: currentItemId});
                this._hideFun();
            });
        },
        _showFun() {
            this.setData({show: true});
        },
        _hideFun() {
            this.setData({show: false});
        },
        _doNothing() {

        }
    }
});
