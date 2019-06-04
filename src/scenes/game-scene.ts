import { Exit } from '../objects/exit'
import { Player } from '../objects/player'

export class GameScene extends Phaser.Scene {
  private layer: Phaser.Tilemaps.StaticTilemapLayer
  private map: Phaser.Tilemaps.Tilemap
  private tileset: Phaser.Tilemaps.Tileset

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

    this.convertObjects()

    this.physics.add.collider(this.player, this.layer)
    this.physics.add.collider(this.player, this.exit, this.exitCallback)

    this.cameras.main.startFollow(this.player)

    this.cameras.add(596, 0, 370, 370)
      .setName('mini')
      .setOrigin(0, 0)
      .setZoom(0.1)
  }

  update(): void {
    this.player.update()
  }

  private convertObjects(): void {
    const objects = this.map.getObjectLayer('Objects').objects as any[]

    objects.forEach(object => {
      if (object.name === 'Player') {
        this.player = new Player({
          scene: this,
          x: object.x,
          y: object.y,
          key: 'player'
        })
      } else if (object.name === 'Enemy') {
        // TODO
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
