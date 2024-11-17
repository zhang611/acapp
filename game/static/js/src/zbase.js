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
