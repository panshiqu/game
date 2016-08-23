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

        // 位置
        side: true,
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
            this.onTips("请装左岸货物");
            return;
        }

        // 请装右岸
        if (!this.side && node.parent === this.left.node) {
            cc.log("onBoat failed: please select right side");
            this.onTips("请装右岸货物");
            return;
        }

        // 船已超载
        if (this.boat.node.childrenCount >= 1) {
            cc.log("onBoat failed: boat is full");
            this.onTips("船已超载");
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
        this.boat.node.runAction(cc.sequence(cc.moveTo(2.0, cc.p(-this.boat.node.x, 0)), cc.callFunc(function () {
            // 过河
            this.side = !this.side;

            // 船上货物
            var components = this.boat.getComponentsInChildren(cc.Button);

            // 自动下船
            for (var i = 0; i < components.length; i++) {
                this.offBoat(components[i].node);
            }

            // 竞争检测
            if (!this.raceDetect()) {
                this.boat.node.setPosition(cc.p(-this.boat.node.x, 0));

                for (var j = 0; j < components.length; j++) {
                    this.onBoat(components[j].node);
                }

                this.side = !this.side;
            }

            // 输赢判断
            if (this.right.node.childrenCount === 3) {
                this.onTips("恭喜过关");
            }
        }, this)));
    },

    raceDetect: function () {
        if (this.side) {
            if (this.right.node.getChildByName("Sheep")) {
                // 右岸狼吃羊
                if (this.right.node.getChildByName("Wolf")) {
                    this.onTips("右岸的羊被狼吃掉了");
                    return false;
                }
                // 右岸羊吃菜
                if (this.right.node.getChildByName("Cabbage")) {
                    this.onTips("右岸的菜被羊吃掉了");
                    return false;
                }
            }
        } else {
            if (this.left.node.getChildByName("Sheep")) {
                // 左岸狼吃羊
                if (this.left.node.getChildByName("Wolf")) {
                    this.onTips("左岸的羊被狼吃掉了");
                    return false;
                }
                // 左岸羊吃菜
                if (this.left.node.getChildByName("Cabbage")) {
                    this.onTips("左岸的菜被羊吃掉了");
                    return false;
                }
            }
        }

        return true;
    },

    onTips: function (str) {
        this.tips.string = str;
        this.tips.node.opacity = 255;
        this.tips.node.runAction(cc.fadeOut(2.0));
    },

    update: function (dt) {

    },
});
