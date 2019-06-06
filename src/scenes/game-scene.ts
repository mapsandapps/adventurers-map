import { Enemy } from '../objects/enemy';
import { Exit } from '../objects/exit'
import { Player } from '../objects/player'

export class GameScene extends Phaser.Scene {
  private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer
  private layer: Phaser.Tilemaps.StaticTilemapLayer
  private map: Phaser.Tilemaps.Tilemap
  private tileset: Phaser.Tilemaps.Tileset

  private enemies: Phaser.GameObjects.Group
  private exit: Exit
  private player: Player

  private gameInPlay: boolean

  constructor() {
    super({
      key: "GameScene"
    })
  }

  init(): void {}

  create(): void {
    this.map = this.make.tilemap({ key: 'levelMap' })

    this.tileset = this.map.addTilesetImage('RPGpack_sheet', 'RPGpack_sheet', 64, 64, 1, 2)
    this.backgroundLayer = this.map.createStaticLayer('Background', this.tileset, 0, 0)
    this.layer = this.map.createStaticLayer('Map', this.tileset, 0, 0)
    this.layer.setCollisionByProperty({ collide: true })

    this.enemies = this.add.group({ })

    this.convertObjects()

    this.physics.add.collider(this.player, this.layer)
    this.physics.add.collider(this.player, this.exit, this.exitCallback, null, this)

    this.cameras.main.startFollow(this.player)

    this.add.image(576, 20, 'parchment')
      .setScrollFactor(0)
      .setOrigin(0, 0)

    this.cameras.add(576, 20, 370, 370)
      .setName('mini')
      .setOrigin(0, 0)
      .setZoom(0.1)
      .ignore(this.backgroundLayer)

    this.gameInPlay = true
  }

  update(): void {
    this.player.update()

    this.enemies.children.each((enemy: Enemy) => {
      let playerFound = enemy.lookForPlayer(this.player.body.x, this.player.body.y, this.map)

      if (playerFound) {
        const distance = Phaser.Math.Distance.Between(this.player.body.x, this.player.body.y, enemy.x, enemy.y)
        if (distance < 500 && this.gameInPlay) {
          this.gameLost(enemy)
        }
      }

      enemy.update()
    }, this)
  }

  private restartScene(): void {
    this.scene.restart()
  }

  private setObjectsInactive(): void {
    this.player.setActive(false)
    this.enemies.children.each(enemy => {
      enemy.setActive(false)
    })
  }

  private gameLost(enemy): void {
    this.gameInPlay = false
    this.physics.moveToObject(enemy, this.player, null, 500)
    this.time.addEvent({
      delay: 4000,
      callback: this.restartScene,
      callbackScope: this
    })

    this.setObjectsInactive()

    this.add.text(
      this.player.x,
      this.player.y,
      'Oh no!\nOne of the teachers caught you trying to escape!', {
        align: 'center'
      }
    ).setOrigin(0.5, 0.5)
  }

  private convertObjects(): void {
    const objects = this.map.getObjectLayer('Objects').objects as any[]

    objects.forEach((object, i) => {
      if (object.name === 'Player') {
        this.player = new Player({
          scene: this,
          x: object.x,
          y: object.y,
          key: 'player'
        })
      } else if (object.name === 'Enemy') {
        let enemy = new Enemy({
          scene: this,
          x: object.x,
          y: object.y,
          key: `enemy${i % 3}`
        })

        this.physics.add.collider(enemy, this.layer)
        this.physics.add.collider(enemy, this.player)

        this.enemies.add(enemy)
      } else if (object.name === 'Exit') {
        this.exit = new Exit({
          scene: this,
          x: object.x,
          y: object.y,
          key: 'exit'
        })
      }
    })
  }

  private exitToWinScene(): void {
    this.setObjectsInactive()
    this.scene.stop()
    this.scene.get('WinScene').scene.start()
  }

  private exitCallback(): void {
    if (this.gameInPlay) {
      this.gameInPlay = false
      this.cameras.main.fadeOut(1000)
      this.cameras.getCamera('mini').fadeOut(1000)
      this.time.addEvent({
        delay: 1000,
        callback: this.exitToWinScene,
        callbackScope: this
      })
    }
  }
}
