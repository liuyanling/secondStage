/**
 * Created by Administrator on 16-5-11.
 */
/* 该设计将飞船划分为动力系统，状态系统，能源系统 以及信号系统，四个模块。通过Mediator与指挥官发出测消息指令进行接收和执行*/
(function() {
    //根据浏览器类型设置相应的requestAnimationFrame   P685.

    var Spaceship = function(id) {    //Spaceship是一个构造函数名
        this.id = id;
        this.power = 100; //飞船初始电量
        this.currState = "stop"; //飞船初始状态
        this.mediator = null; //飞船注册的mediator
        this.orbit = 100 + 50 * id - 20; //飞船所在轨道的半径
        this.deg = 0; //飞船初始位置的角度
        this.timer = null;
    };
    /*[dynamicManager 飞船动力系统，控制飞船的飞行以及停止]*/
Spaceship.prototype.dynamicManager = function() {
        var self = this;
        var fly = function() {
            self.timer = setInterval(function() {
                self.deg += 1;
                if (self.deg >= 360) self.deg = 0;  //飞完一圈时，重置角度
            },10);
            shows("飞船 No." + self.id + " 正在飞行中！");
        };

        var stop = function() {
            clearInterval(self.timer);
           shows("飞船 No." + self.id + " 停止飞行！");
        };

        return {
            fly: fly,
            stop: stop
        };
    };
    //能源系统 控制飞船能源
    Spaceship.prototype.powerManager = function() {
        var self = this;
        /*[charge: 飞船充电]*/
        var charge = function() {
            var chargeRate =0.3;
            var timer = setInterval(function() {
                //若飞船在飞行或者被销毁则不再充电
                if (self.currState == "fly" || self.currState == "destroy") {
                    clearInterval(timer);
                    return false;
                }
                if (self.power >= 100) { //如果飞船满电则不再充电
                    clearInterval(timer);
                    self.power = 100;
                    return false;
                }
                self.power += chargeRate;
                return true;
            }, 20);
            shows("飞船 No." + self.id + "正在充电！");
        };
        /* [discharge: 飞船放电]*/
        var discharge = function() {
            var timer = setInterval(function() {
                //若飞船停止或者被销毁则不再放电
                if (self.currState == "stop" || self.currState == "destroy") {
                    clearInterval(timer);
                    return false;
                }
                if (self.power <= 0) {
                    clearInterval(timer);
                    self.power = 0;
                    self.stateManager().changeState("stop");
                    return false;
                }
                self.power -= 0.2;
            }, 20);
            shows("飞船 No." + self.id + "能量损失中！");
        };
        return {
            charge: charge,
            discharge: discharge
        };
    };
    //stateManager  状态系统采用状态模式设计
    Spaceship.prototype.stateManager = function() {
        var self = this;
        var states = {
            fly: function() {
                self.currState = "fly";
                self.dynamicManager().fly();
                self.powerManager().discharge();
            },
            stop: function() {
                self.currState = "stop";
                self.dynamicManager().stop();
                self.powerManager().charge();
            },
            destroy: function() {
                self.currState = "destroy";
                self.mediator.remove(self);
                // AnimUtil.onDraw(self.mediator.getSpaceships());
            }
        };
        /* [changeState 执行指令改变飞船状态]*/
        var changeState = function(state) {
            //根据状态执行指令
            states[state] && states[state]();
            shows("飞船" + self.id + "状态为 " + state);
        };
        return {
            changeState: changeState
        };
    };
    //信号系统 飞船接收指令模块
    Spaceship.prototype.signalManager = function(message, from) {
        if (this.currState != message.cmd && this.id == message.id) {
            this.stateManager().changeState(message.cmd);
        }
    };
    /*[Commander 指挥官，负责单向指令发送，不接收外界消息]*/
    var Commander = function() {
        this.id = "Liu";
        this.cmds = [];
        this.mediator = null;
    };
    /*[send 发送指令，并将指令压入指令历史cmds中]*/
    Commander.prototype.send = function(message) {
        this.mediator.send(message);
        this.cmds.push(message);
    };
    /* [Mediator Mediator的作用是让不同对象进行消息传递，并保存更新飞船队列数据；该对象把
     飞船队列以及指挥官通过闭包封装为私有变量，外界无法直接获取]*/
    var Mediator = function() {
        var spaceships = [];
        var commander = null;
        return {
            /*[register: 所有对象需要在Mediator里面注册，否则无法通讯] */
            register: function(obj) {
                if (obj instanceof Commander) {
//                   commander = obj;
                    obj.mediator = this;
                    shows("中介者登记指挥官： " + obj.id);
                    return true;
                } else if (obj instanceof Spaceship) {
                    spaceships[obj.id] = obj;
                    obj.mediator = this;
                    shows("中介者登记 " + "飞船： " + obj.id);
                    return true;
                }
            },
            /*[send 发送消息，当发送超过失败率后，对方可以收到数据；有单播和广播两种发送方式] */
            send: function(message, from, to) {
              //  var self = this;
               // setTimeout(function() {
                    var rate = Math.random() > 0.012 ? true : false; //若随机数大于发送失败率则执行消息发送
                    if ( rate ) {
//                        if (to) { //unicast
                        //                           to.receive(msg, from);
                        //                       } else { //broadcast;
                        if (message.cmd == "launch") { //若收到的指令是Launch则执行创建对象
                            this.create(message);
                        }
                        for (var key in spaceships) {
                            //                               if (spaceships[key] !== from) { //所有飞船迭代接收消息
                            spaceships[key].signalManager(message, from);
//                                }
                        }
                        //                      }
                        shows("发送成功！");
                        return true;
                    } else {
                        shows("发送失败！");
                        return false;
                    }
               // }, 1000);
            },
            /* [remove 移除通讯对象] */
            remove: function(obj) {
                if (obj instanceof Spaceship) {
                    shows("销毁飞船 No." + obj.id);
                    delete spaceships[obj.id];
                    // spaceships[obj.id] = undefined;
                    return true;
                }
            },
            /* [create 创建通讯对象]*/
            create: function(message) {
                if (spaceships[message.id] !== undefined) {
                    shows("飞船已经存在！");
                    return false;
                }
                var spaceship = new Spaceship(message.id);
                this.register(spaceship);
                return true;
            },
            /* [getSpaceships 获取飞船队列，由于飞船队列spaceships已经封装起来，因此外界只能通过该方法获取飞船队列]  */
            getSpaceships: function() {
                return spaceships;
            }
        };
    };
    /*[Message 消息载体*/
    var Message = function(id, cmdName) {
        this.id =id;
        this.cmd = cmdName;
    };
    /*[buttonHandler 按钮句柄] */
    var buttonHandler = function(commander) {
        var id = null;
        var cmd = null;
    //    $("button").on("click", function() {
        $(".btn").click(function() {
            var  cmdName= $(this).attr("name");
            id = $(this).parent().index();
            cmd = cmdName;
            var message = new Message(id, cmd);//第几轨道的什么操作
            commander.send(message);
            return true;
        });
    };
    /*[控制台工具 负责显示运行信息] */
    var shows = function(msg) {
        $("#console ul").append( $("<li></li>").text(msg));
    };
    /**
     * [动画工具 该动画采用双缓存刷新以及requestAnimationFrame致力消除动画闪屏现象]
     */
  var AnimUtil = (function() {
        var canvas = document.getElementById("screen");
        canvas.width = 800;
        canvas.height = 800;
        var ctx = canvas.getContext("2d");  //获取屏幕画布

        var cacheCanvas = document.createElement("canvas");
        cacheCanvas.width = 800;
        cacheCanvas.height = 800;
        var cacheCtx = cacheCanvas.getContext("2d"); //生成缓存画布

        var timer = null;  //定时器
        var mediator = null; //控制动画刷新的mediator

        /**
         * [drawPlanet 画行星]
         */
        var drawPlanet = function(_ctx) {
            // ctx.fillStyle = "#1b93ef";
            var x = 350;
            var y = 350;
            var planet = new Image();
            planet.src = "earth.png";
            planet.onload = function() {
                _ctx.drawImage(planet, x, y, 50 * 2, 50 * 2);
            };
        };

        /**
         * [drawOrbit 画飞船轨道]
         */
        var drawOrbit = function(_ctx) {
            for (var i = 0; i < 4; i++) {
                _ctx.strokeStyle = "#999";
                _ctx.beginPath();
                _ctx.arc(400, 400, 100 + 50 * i, 0, 2 * Math.PI);
                _ctx.closePath();
                _ctx.stroke();
            }
        };

        /**
         * [动画更新时背景不用刷新，因此仅仅在初始化时绘制一次在background画布上的背景，减少计算量。background画布位于screen画布下面，通过css中z-index属性进行叠加]
         */
        (function() {
            var canvas = document.getElementById("background");
            canvas.width = 800;
            canvas.height = 800;
            var _ctx = canvas.getContext("2d");
            _ctx.clearRect(0, 0, 800, 800);
            drawPlanet(_ctx);
            drawOrbit(_ctx);
        })();

        /* [drawSpaceship 画飞船] */
        var drawSpaceship = function(_ctx, spaceship) {
			cacheCtx.clearRect(0, 0, 800, 800); //每次更新清空缓存画布
            var spaceshipImg = new Image();  //创建飞船贴图
            spaceshipImg.src = "rocket.png"; 
            spaceshipImg.onload = function() { //当飞船贴图加载后开始在画布上画(由于onload是异步进行的，所以执行顺序上会不是太清晰)
                    _ctx.save(); //保存画布原有状态
                    _ctx.translate(400, 400);  //更改画布坐标系，将画布坐标原点移到画布中心
                    _ctx.rotate(-spaceship.deg * Math.PI / 180); //根据飞船飞行角度进行画布选择
                   
                    //画电量条，根据电量状态改变颜色
                    _ctx.beginPath();
                    if (spaceship.power > 70) {
                        _ctx.strokeStyle = "#70ED3F";
                    } else if (spaceship.power < 70 && spaceship.power > 30) {
                        _ctx.strokeStyle = "#fccd1f";
                    } else {
                        _ctx.strokeStyle = "#fb0000";
                    }
                    _ctx.lineWidth = 5;
                    _ctx.moveTo(spaceship.orbit, -5);
                    _ctx.lineTo(spaceship.orbit + 40 * (spaceship.power / 100), -5);
                    _ctx.stroke();

                    _ctx.drawImage(spaceshipImg, spaceship.orbit, 0, 40, 40); //画飞船贴图
                    _ctx.restore(); //恢复画布到原有状态
                    ctx.clearRect(0, 0, 800, 800);  
                    ctx.drawImage(cacheCanvas, 0, 0, 800, 800); //将缓存画布内容复制到屏幕画布上
                    return true;
          
            };
        };

        /**
         * [onDraw 绘制屏幕画布]
         */
        var onDraw = function(spaceships) {
            if (!(spaceships === undefined || spaceships.every(function(item, index, array) {
                    return item === undefined;  //判断飞船队列是否存在，以及飞船队列是否为空；若不是则执行下面步骤
                }))) {
                //cacheCtx.clearRect(0, 0, 800, 800); //每次更新清空缓存画布
                for (var i = 0; i < spaceships.length; i++) {  //迭代绘制飞船
                    if (spaceships[i] !== undefined) {
                        drawSpaceship(cacheCtx, spaceships[i]);
                    }
                }
            } else {
                ctx.clearRect(0, 0, 800, 800);
            }
        };

        /**
         * [animLoop 动画循环]
         */
        var animLoop = function() {
            onDraw(mediator.getSpaceships());
			setTimeout(animLoop,20);
         };

        /**
         * [setMediator  为AnimUtil设置Mediator，通过mediator保存的状态控制动画更新]
         */
        var setMediator = function(_mediator) {
            mediator = _mediator;
        };

        return {
            setMediator: setMediator,
            animLoop: animLoop
        };
    })();

  
    //主线程
    window.onload = function() {
        var commander = new Commander();
        var mediator = new Mediator();
        mediator.register(commander);
        mediator.register(AnimUtil);
        buttonHandler(commander);
        AnimUtil.setMediator(mediator);
        AnimUtil.animLoop();
    };

})();
