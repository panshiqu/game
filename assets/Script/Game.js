cc.Class({
    extends: cc.Component,

    properties: {
        // 标题
        title: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        if (this.title && this.title.node.width > cc.view.getVisibleSize().width) {
            this.title.node.width = cc.view.getVisibleSize().width;
        }
    },

    onBtnClick: function (event) {
        cc.director.loadScene("Game"+event.target.name);
    },

    onBtnBack: function () {
        cc.director.loadScene("Game");
    },

    update: function (dt) {

    },
});
