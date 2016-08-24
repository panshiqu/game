cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {

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
