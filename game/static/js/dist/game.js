class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class='ac-game-menu'>
            <div class="ac-game-menu-field">
                <div class="ac-game-menu-field-item ac-game-menu-field-item-single">
                    单人模式
                </div>
                <br>
                <div class="ac-game-menu-field-item ac-game-menu-field-item-multi">
                    多人模式
                </div>
                <br>
                <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                    设置
                </div>
            </div>

</div>

`);
        this.root.$ac_game.append(this.$menu);
        this.$single = this.$menu.find('.ac-game-menu-field-item-single')
        this.$multi = this.$menu.find('.ac-game-menu-field-item-multi')
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings')

        this.start();

    }
    start() {
        this.add_listening_event();
    }

    add_listening_event() {
        let outer = this;
        this.$single.click(function () {
            outer.hide();
            outer.root.playground.show();
            console.log("click single mode")
        });
        this.$multi.click(function () {
            console.log("click multi mode")
        });
        this.$settings.click(function () {
            console.log("click settings mode")
        });
    }

    // 显示menu
    show() {
        this.$menu.show();
    }

    // 关闭menu
    hide() {
        this.$menu.hide();

    }


}
let AC_GAME_OBJECT = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECT.push(this);
        this.has_called_start = false;
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔
    }

    start() {

    }

    update() {

    }

    // 在被销毁前执行
    on_destroy() {

    }

    destroy() {
        this.on_destroy();
        for (let i = 0; i < AC_GAME_OBJECT.length; i++) {
            if (AC_GAME_OBJECT[i] === this) {
                AC_GAME_OBJECT.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < AC_GAME_OBJECT.length; i++) {
        let obj = AC_GAME_OBJECT[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {

    }

    update() {
        this.render();

    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";  // 加上透明度可以实现尾部模糊的效果
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}class Player extends AcGameObject {
    constructor(playground, x, y, radious, color, speed, is_me) {
        super();
        this.playground = playground;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;
        this.radious = radious;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.ctx = this.playground.game_map.ctx;
        this.eps = 0.1;
        this.cur_skill = null;
    }

    start() {
        if (this.is_me) {
            this.add_listening_events();
        }

    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function(){
            return false;
        });



        this.playground.game_map.$canvas.mousedown(function(e){
            if(e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY);
                }
                outer.cur_skill = null;
            }
        });

        $(window).keydown(function(e){
            if (e.which === 81) {
                outer.cur_skill = "fireball";
                return false;
            }
        });

    }

    shoot_fireball(tx, ty) {
        let x = this.x;
        let y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty-this.y, tx-this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length);
    };

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx*dx+dy*dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty-this.y, tx-this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }



    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radious, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    update() {
        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
        } else {
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        this.render();
    }

}class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.eps = 0.1;
        
    }

    start() {

    }


    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    update() {
        if (this.move_length < this.eps){
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        this.render();

    }


}class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        // this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.players = [];
        this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, "white", this.height*0.15, true));


        this.start();
    }

    start() {

    }

    show() {
        this.$playground.show();
    }

    hide() {
        this.$playground.hide();
    }
}export class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        // this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }

    start() {

    }
}
