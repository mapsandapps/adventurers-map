import { Enemy } from '../objects/enemy';
import { Exit } from '../objects/exit'
import { Player } from '../objects/player'

export class GameScene extends Phaser.Scene {
  private layer: Phaser.Tilemaps.StaticTilemapLayer
  private map: Phaser.Tilemaps.Tilemap
  private tileset: Phaser.Tilemaps.Tileset

  private enemies: Phaser.GameObjects.Group
  private exit: Exit
  private player: Player

  constructor() {
    super({
      key: "GameScene"
    })
  }

  init(): void {}

  create(): void {
    this.map = this.make.tilemap({ key: 'levelMap' })

    this.tileset = this.map.addTilesetImage('RPGpack_sheet', 'RPGpack_sheet', 64, 64, 1, 2)
    this.layer = this.map.createStaticLayer('Map', this.tileset, 0, 0)
    this.layer.setCollisionByProperty({ collide: true })

    this.enemies = this.add.group({ })

    this.convertObjects()

    this.physics.add.collider(this.player, this.layer)
    this.physics.add.collider(this.player, this.exit, this.exitCallback)

    this.cameras.main.startFollow(this.player)

    this.cameras.add(576, 20, 370, 370)
      .setName('mini')
      .setOrigin(0, 0)
      .setZoom(0.1)
  }

  update(): void {
    this.player.update()

    this.enemies.children.each((enemy: Enemy) => {
      let playerFound = enemy.lookForPlayer(this.player.body.x, this.player.body.y, this.map)

      if (playerFound) {
        this.playerLost()
      }

      enemy.update()
    }, this)
  }

  private playerLost(): void {
    console.warn('You lost!')
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

  private exitCallback(player, exit): void {
    console.warn('You won!') // TODO
    console.log(player)
    console.log(exit)
  }
}
