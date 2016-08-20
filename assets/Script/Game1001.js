cc.Class({
    extends: cc.Component,

    properties: {
        left: {
            default: null,
            type: cc.Layout,
        },
        
        boat: {
            default: null,
            type: cc.Layout,
        },
        
        right: {
            default: null,
            type: cc.Layout,
        },
        
        side: true,
    },

    onLoad: function () {

    },

    onBoat: function (node) {
        cc.log("onBoat:", node.name);

        // 节点坐标
        node.setPosition(0, 0);

        // 移除节点
        node.removeFromParent(false);

        // 添加节点
        this.boat.node.addChild(node);

        cc.log("onBoat successfully:", node.name);
    },

    offBoat: function (node) {
        cc.log("offBoat:", node.name);

        if (!node.isChildOf(this.boat.node)) return;

        // 节点坐标
        node.setPosition(0, 0);

        // 移除节点
        node.removeFromParent(false);

        // 船在左岸
        if (this.side) {
            this.left.node.addChild(node);
        } else {
            this.right.node.addChild(node);
        }

        cc.log("offBoat successfully:", node.name);
    },

    onBtnClick: function (event) {
        // 点击节点
        var node = event.target;

        // 船上节点
        if (node.parent === this.boat.node) {
            this.offBoat(node);
        } else {
            this.onBoat(node);
        }
    },

    update: function (dt) {

    },
});
