class UIScene extends Phaser.Scene {
    constructor(){
        super({key: 'UIScene', active: true})
    }
    create(){
        console.log('ui scene');
        this.coinScore = 0
        //coin text
        this.coinText = this.add.text(300,4,'Coins: '+this.coinScore, {font: '8px', fill:'#ffffff'})
        //////////////////////
        //healthbar
        this.healthbar = new Healthbar(this, 8, 2, 100)
    }
    updateCoins(){
        this.coinScore+= 1
        this.coinText.setText('Coins: '+this.coinScore)

    }
    reset(){
        this.coinScore = 0
        this.coinText.setText('Coins: '+this.coinScore)
        this.healthbar.updateHealth(100)
    }
}