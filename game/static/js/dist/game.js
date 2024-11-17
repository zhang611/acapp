class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div>游戏界面</div>`);

        this.hide();
        this.root.$ac_game.append(this.$playground);
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
}class AcGameMenu {
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
class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        // console.log('AcGame ok')
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }

    start() {

    }
}
