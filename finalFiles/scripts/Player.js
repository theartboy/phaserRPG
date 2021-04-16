class Player extends Entity {
    constructor(scene, x, y, textureKey, health){
        super(scene, x, y, textureKey, 'Player')

        const animFrameRate = 8
        const anims = scene.anims
        this.health = health
        this.facing = 'down'

        anims.create({
            key: 'player-left',
            frames: anims.generateFrameNumbers(this.textureKey, {
                 start: 4,
                end: 7
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'player-right',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 0,
                end: 3
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'player-up',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 8,
                end: 11
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'player-down',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 12,
                end: 15
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.idleFrame = {
            down: 12,
            left: 4,
            right: 0,
            up: 8
        }
        this.setFrame(this.idleFrame.down)

        /////////////////
        //inputs
        // this.cursors = this.input.keyboard.createCursorKeys()
        const {LEFT,RIGHT,UP,DOWN,W,A,S,D} = Phaser.Input.Keyboard.KeyCodes
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            w: W,
            a: A,
            s: S,
            d: D
        })
         
    }//end constructor


    update(){
        const {keys} = this //output: this.keys
        const speed = 100
        const previousVelocity = this.body.velocity.clone()

        this.body.setVelocity(0)
        //movement
        if (keys.left.isDown || keys.a.isDown) {
            this.body.setVelocityX(-speed)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.body.setVelocityX(speed)
        }

        if (keys.up.isDown || keys.w.isDown) {
            this.body.setVelocityY(-speed)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.body.setVelocityY(speed)
        }

        this.body.velocity.normalize().scale(speed)

        //animations
        if (keys.up.isDown || keys.w.isDown) {
            this.anims.play('player-up', true)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.anims.play('player-down', true)
        } else
        if (keys.left.isDown || keys.a.isDown) {
            this.anims.play('player-left', true)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.anims.play('player-right', true)
        } else {
            this.anims.stop()
        }
 
        if (this.anims.currentAnim){
            this.facing = this.anims.currentAnim.key.split('-')[1]
            // console.log(this.facing);
        }

        //set idle animations
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            //show idle anims
            if (previousVelocity.x < 0) {
                this.setFrame(this.idleFrame.left)
            } else if (previousVelocity.x > 0) {
                this.setFrame(this.idleFrame.right)
            } else if (previousVelocity.y < 0) {
                this.setFrame(this.idleFrame.up)
            } else if (previousVelocity.y > 0) {
                this.setFrame(this.idleFrame.down)
            }
        }

    }
}