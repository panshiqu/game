cc.Class({
    extends: cc.Component,

    properties: {
        // 左岸
        left: {
            default: null,
            type: cc.Layout,
        },

        // 船
        boat: {
            default: null,
            type: cc.Layout,
        },

        // 右岸
        right: {
            default: null,
            type: cc.Layout,
        },

        // 描述
        desc: {
            default: null,
            type: cc.Label,
        },

        // 提示
        tips: {
            default: null,
            type: cc.Label,
        },

        // 过河
        cross: {
            default: null,
            type: cc.Button,
        },

        // 位置
        side: true,

        // 时间
        time: 30,
    },

    onLoad: function () {
        // 描述宽度
        this.desc.node.width = cc.winSize.width - 20;

        // 船在左岸
        var x = -cc.winSize.width/2.0 + this.left.node.width*1.6;
        this.boat.node.setPosition(x, 0);
    },

    onBoat: function (node) {
        cc.log("onBoat:", node.name);

        // 请装左岸
        if (this.side && node.parent === this.right.node) {
            cc.log("onBoat failed: please select left side");
            this.onTips("请装左岸家人");
            return;
        }

        // 请装右岸
        if (!this.side && node.parent === this.left.node) {
            cc.log("onBoat failed: please select right side");
            this.onTips("请装右岸家人");
            return;
        }

        // 船已超载
        if (this.boat.node.childrenCount >= 2) {
            cc.log("onBoat failed: boat is full");
            this.onTips("桥已超载");
            return;
        }

        // 节点坐标
        node.setPosition(0, 0);

        // 移除节点
        node.removeFromParent(false);

        // 添加节点
        this.boat.node.addChild(node);

        cc.log("onBoat successful:", node.name);
    },

    offBoat: function (node) {
        cc.log("offBoat:", node.name);

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

        cc.log("offBoat successful:", node.name);
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

    onBtnCrossRiver: function () {
        // 重新开始
        if (this.time < 0) {
            cc.director.loadScene('Game1004');
        }

        // 无人掌灯
        if (this.boat.node.childrenCount <= 0) {
            cc.log("onBtnCrossRiver failed: none light");
            this.onTips("无人掌灯");
            return;
        }

        // 减少时间
        var time = this.maxCrossTime();
        this.time -= time;

        this.boat.node.runAction(cc.sequence(cc.moveTo(time, cc.p(-this.boat.node.x, 0)), cc.callFunc(function () {
            // 过河
            this.side = !this.side;

            // 船上家人
            var components = this.boat.getComponentsInChildren(cc.Button);

            // 自动下船
            for (var i = 0; i < components.length; i++) {
                this.offBoat(components[i].node);
            }

            // 更新时间
            this.desc.string = "剩余" + this.time + "秒";

            // 输赢判断
            if (this.time < 0) {
                this.onTips("您输了");
                this.cross.getComponentInChildren(cc.Label).string = "重新开始";
            } else if (this.right.node.childrenCount === 5) {
                this.onTips("恭喜过关");
            }
        }, this)));
    },

    maxCrossTime: function () {
        if (this.boat.node.getChildByName("Grandpa")) {
            return 12;
        }

        if (this.boat.node.getChildByName("Father")) {
            return 8;
        }

        if (this.boat.node.getChildByName("Mother")) {
            return 6;
        }

        if (this.boat.node.getChildByName("Ybrother")) {
            return 3;
        }

        return 1;
    },

    onTips: function (str) {
        this.tips.string = str;
        this.tips.node.opacity = 255;
        this.tips.node.runAction(cc.fadeOut(2.0));
    },

    update: function (dt) {

    },
});
