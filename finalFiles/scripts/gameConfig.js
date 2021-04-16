
window.addEventListener('load', () => {
let config = {
    type: Phaser.AUTO,
    width: 400,
    height: 320,
    backgroundColor: 0x220283,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: {
                y: 0
            }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "thegame"
    },
    pixelArt: true,
    scene: [GameScene, UIScene, LoseScene]
}
const game = new Phaser.Game(config)
}) //end load listener




class TitleScene extends Phaser.Scene {
    constructor() {
        super('titleScene')
    }

    preload() {

    } //end preload

    create() {

    } //end create

    update() {

    } //end update
} //end title scene

class WinScene extends Phaser.Scene {
    constructor() {
        super('winScene')
    }

    preload() {

    } //end preload

    create() {

    } //end create

    update() {

    } //end update
} //end title scene

class LoseScene extends Phaser.Scene {
    constructor() {
        super('loseScene')
    }
    init(data){
        this.remainingHealth = data.health
        console.log(this.remainingHealth);
        console.log('help');
    }

    preload() {
        this.cameras.main.setBackgroundColor(0xcc0000)
        // this.load.image('bg', '../assets/characters.png')

    } //end preload

    create() {
        this.add.image(100,100,'characters')
    } //end create

    update() {

    } //end update
} //end title scene