import {getActiveArguments} from "../../utils/util";

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {},
    data: {
        title: '',
        content: '',
        confirmText: '',
        cancelText: ''
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
        },

    },
    /**
     * 组件的方法列表
     */
    methods: {
        setDialog({title, content, confirmText, cancelText}) {
            this.setData(getActiveArguments(arguments[0]));
        },
        setConfirmEvent({listener}) {
            this.confirmEventListener = listener;
        },

        setCancelEvent({listener}) {
            this.cancelEventListener = listener;
        },

        show() {
            this.setData({
                showDialog: true
            })
        },
        hide() {
            this.setData({
                showDialog: false
            })
        },
        _confirmEvent() {
            this.hide();
            this.confirmEventListener && this.confirmEventListener();
        },
        _cancelEvent() {
            this.hide();
            this.cancelEventListener && this.cancelEventListener();
        },
    }
});
