import { Player } from '../objects/player'

export class GameScene extends Phaser.Scene {
  private layer: Phaser.Tilemaps.StaticTilemapLayer
  private map: Phaser.Tilemaps.Tilemap
  private tileset: Phaser.Tilemaps.Tileset

  private player: Player

  constructor() {
    super({
      key: "GameScene"
    })
  }

  init(): void {}

  create(): void {
    this.map = this.make.tilemap({ key: 'levelMap' })

    this.tileset = this.map.addTilesetImage('RPGpack_sheet')
    this.layer = this.map.createStaticLayer('Map', this.tileset, 0, 0)
    this.layer.setCollisionByProperty({ collide: true })

    this.player = new Player({
      scene: this,
      x: 128,
      y: 128,
      key: 'player'
    })

    this.physics.add.collider(this.player, this.layer)

    this.cameras.main.startFollow(this.player)
  }

  update(): void {
    this.player.update()
  }
}
