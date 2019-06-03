export class GameScene extends Phaser.Scene {
  private layer: Phaser.Tilemaps.StaticTilemapLayer
  private map: Phaser.Tilemaps.Tilemap
  private tileset: Phaser.Tilemaps.Tileset

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
  }
}
