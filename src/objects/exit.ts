export class Exit extends Phaser.GameObjects.Image {
  constructor(params) {
    super(params.scene, params.x, params.y, params.key)

    this.initImage()
    this.scene.add.existing(this)
  }

  private initImage(): void {
    this.setOrigin(0, 0)

    this.scene.physics.world.enable(this)
    this.body.setImmovable(true)
  }

  update(): void {}
}
