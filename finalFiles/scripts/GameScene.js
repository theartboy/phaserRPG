class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    preload() {
        this.cursors
        this.cameras.main.setBackgroundColor(0x9900e3)
        this.cameras.main.height = 256
        this.cameras.main.width = 336
        this.cameras.main.setPosition(32,32)
        this.load.image('bullet', '../assets/bullet.png')
        this.load.image('particle', '../assets/particle.png')
        this.load.image('tiles', '../assets/Tilemap/purple.png')
        this.load.tilemapTiledJSON('map', '../scripts/purpleMapObjectsVideo.json')

        this.load.spritesheet('characters', '../assets/characters.png', {
            frameWidth: 16,
            frameHieght: 16
        })
        this.load.spritesheet('unicorn', '../assets/sprites/unicorn32.png', {
            frameWidth: 32,
            frameHieght: 32
        })

        this.load.spritesheet('pickups', '../assets/sprites/pickupsSmall.png', {
            frameWidth: 16,
            frameHieght: 16
        })

        this.load.atlas('tpOnline', '../assets/spritesheetV2.png', '../assets/spritesheetV2.json')
        this.load.atlas('monsters', '../assets/sprites/monsters.png', '../assets/sprites/monsters.json')
        this.player
        this.keys
        this.enemy
        this.enemies
        this.healthbar
        this.projectiles
        this.keys
        this.lastFiredTime = 0
        this.emmiter

        this.gems
        this.coins
        // this.coinScore = 0

    } //end preload

    create() {
        ////////////////
        //tilemap
        const map = this.make.tilemap({
            key: 'map'
        })

        const tileset = map.addTilesetImage('purple', 'tiles')
        const belowLayer = map.createStaticLayer('below player', tileset, 0, 0)
        const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
        const aboveLayer = map.createStaticLayer('above player', tileset, 0, 0)
        const pickupLayer = map.createStaticLayer('pickups', tileset, 0, 0)
        const monsterLayer = map.createStaticLayer('monster layer', tileset, 0, 0)

        aboveLayer.setDepth(100)

        worldLayer.setCollisionByProperty({
            collides: true
        })

        this.physics.world.bounds.width = map.widthInPixels
        this.physics.world.bounds.height = map.heightInPixels
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        const debugGraphics = this.add.graphics().setAlpha(0.2)
        worldLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(0, 0, 255),
            faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        })
        ///////////////////////////////
        //pickups
        this.anims.create({
            key: 'coinAnimation',
            frames: this.anims.generateFrameNumbers('pickups', {
                start: 0,
                end: 7
            }),
            frameRate: 12,
            repeat: -1
        })
        this.anims.create({
            key: 'gemAnimation',
            frames: this.anims.generateFrameNumbers('pickups', {
                start: 8,
                end: 15
            }),
            frameRate: 12,
            repeat: -1
        })
        this.coins = this.physics.add.group()
        this.gems = this.physics.add.group()

        pickupLayer.forEachTile(tile => {
            if (tile.index !== -1) {
                // console.log(tile);
                let pickup
                const x = tile.getCenterX()
                const y = tile.getCenterY()
                if (tile.properties.kind === 'goldcoin') {
                    pickup = this.coins.create(x, y, 'coin')
                    pickup.anims.play('coinAnimation', true)
                } else if (tile.properties.kind == 'healthgem') {
                    pickup = this.gems.create(x, y, 'gem')
                    pickup.anims.play('gemAnimation', true)
                }
                pickup.body.width = 16
                pickup.body.height = 16
            }
        })
        ///////////////////////////////
        //player
        this.player = new Player(this, 200, 120, 'unicorn', 100).setScale(0.5)
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)
        this.player.body.setCollideWorldBounds(true)


        //////////////////////////////
        //enemy
        this.enemy = new Enemy(this, 250, 200, 'monsters', 20, 'ghost', 10)
        // this.physics.add.collider(this.enemy, worldLayer)
        this.enemy.body.setCollideWorldBounds(true)

        this.enemy2 = new EnemyFollow(this, 250, 200, 'monsters', 20, 'slime', 5)
        // this.physics.add.collider(this.enemy2, worldLayer)
        this.enemy2.body.setCollideWorldBounds(true)
        this.enemy2.setTint(0x00ff00)

        /////////////////////
        //enemies
        this.enemies = this.add.group()
        this.enemies.add(this.enemy)
        this.enemies.add(this.enemy2)

        // for (let i = 0; i < 8; i++) {
        //     const e = new Enemy(this, 220 + 20 * i, 250, 'monsters', 10, 'bat')
        //     e.body.setCollideWorldBounds(true)
        //     // e.setTint(0x9999ff)
        //     this.enemies.add(e)
        // }
        monsterLayer.forEachTile(tile =>{
            if (tile.properties.kind !== undefined){
                const x = tile.getCenterX()
                const y = tile.getCenterY()
                const e = new Enemy(this, x, y, 'monsters', 10, tile.properties.kind, tile.properties.speed)
                this.enemies.add(e)
                e.body.setCollideWorldBounds(true)
                // e.setTint(0x00ff00)
            }
        }) 

        // //////////////////////
        // //healthbar
        // this.healthbar = new Healthbar(this, 20, 18, 100)

        //////////////////////
        //projectiles
        this.keys = this.input.keyboard.addKeys({
            space: 'SPACE'
        })
        this.projectiles = new Projectiles(this)
          //////////////////////
        //collisions
        this.physics.add.collider(this.player, worldLayer)
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.collider(this.player, this.coins, this.handlePlayerCoinCollision, null, this)
        this.physics.add.collider(this.player, this.gems, this.handlePlayerGemCollision, null, this)
        this.physics.add.collider(this.projectiles, worldLayer, this.handleProjectileWorldCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this)
        this.physics.add.collider(this.enemies, worldLayer)

       /////////////////////////
        //particles
        this.emitter = this.add.particles('particle').createEmitter({
            x: 200,
            y: 200,
            quantity: 15,
            speed: {
                min: -100,
                max: 100
            },
            angle: {
                min: 0,
                max: 360
            },
            scale: {
                start: 1,
                end: 0
            },
            lifespan: 300,
            active: false
        })
        ////////////////
        // //coin text
        // this.coinText = this.add.text(300,20,'Coins: '+this.coinScore, {font: '8px', fill:'#ffffff'})

    } //end create

    ///////////////////////
    //collisions
    handlePlayerCoinCollision(p,c){
        this.coins.remove(c,true,true)//item,removeFromScene,destroyChild 
        // c.destroy()
        // this.coinScore+= 1
        // this.coinText.setText('Coins: '+this.coinScore)
        // let cs = this.coinScore
        // console.log({cs});
        let ui = this.scene.get('UIScene')
        ui.updateCoins()
        // if(ui.c) 
    }

    handlePlayerGemCollision(p,g){
        g.destroy()
        if (p.health < 95){
            p.health += 5
        }
        let ui = this.scene.get('UIScene')
        ui.healthbar.updateHealth(p.health)
    }

    handleProjectileWorldCollision(p) {
        // p.recycle()
        this.projectiles.killAndHide(p)
    }
    handleProjectileEnemyCollision(enemy, projectile) {
        if (projectile.active) {
            enemy.setTint(0xff0000)
            this.time.addEvent({
                delay: 30,
                callback: () => {
                    enemy.explode()
                    projectile.recycle()
                },
                callbackScope: this,
                loop: false
            })
            this.emitter.active = true
            this.emitter.setPosition(enemy.x, enemy.y)
            this.emitter.explode()
        }
    }
    handlePlayerEnemyCollision(p, e) {
        p.health -= e.damage

        let ui = this.scene.get('UIScene')
        ui.healthbar.updateHealth(p.health)
        if (p.health <= 50) {
            this.cameras.main.shake(100, 0.05)
            this.cameras.main.fade(250, 0, 0, 0)
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.coins.children.iterate((child) => {
                    if(child){
                        child.destroy()
                    }
                })
                this.enemies.children.iterate((child)=>{
                    if(child){
                        child.explode()
                    }
                })
                ui.reset()
                // this.scene.restart()
                this.scene.stop('UIScene')
                this.scene.start('loseScene', {health: p.health})

            })
            // this.scene.restart()
        }
        // console.log(p.health);
        this.cameras.main.shake(40, 0.02)
        p.setTint(0xff0000)
        this.time.addEvent({
            delay: 500,
            callback: () => {
                p.clearTint()
            },
            callbackScope: this,
            loop: false
        })
        e.explode()
    }

    update(time, delta) {
        if (this.keys.space.isDown) {
            if (time > this.lastFiredTime) {
                this.lastFiredTime = time + 500
                this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)
            }
        }

        this.player.update()

        if (!this.enemy.isDead) {
            this.enemy.update()
        }
        if (!this.enemy2.isDead) {
            this.enemy2.update(this.player.body.position, time)
        }

        this.enemies.children.iterate((child) => {
            if (!child.isDead) {
                child.update()
            }
        })
    } //end update


} //end gameScene