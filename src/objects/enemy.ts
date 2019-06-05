export class Enemy extends Phaser.GameObjects.Image {
  private line: Phaser.Geom.Line
  private speed: number

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame)

    this.line = new Phaser.Geom.Line()

    this.initContainer()
    this.scene.add.existing(this)
  }

  private initContainer() {
    this.scene.tweens.add({
      targets: this,
      props: { y: this.y - 200 },
      delay: 0,
      duration: 2000,
      ease: "Linear",
      easeParams: null,
      hold: 0,
      repeat: -1,
      repeatDelay: 0,
      yoyo: true
    })

    this.scene.physics.world.enable(this)
  }

  public lookForPlayer(playerX, playerY, map): boolean {
    // make a line between enemy and player; see if view of player is blocked by walls
    this.line.setTo(this.body.x, this.body.y, playerX, playerY)

    let intersectingTiles = map.getTilesWithinShape(this.line, {
      isColliding: true
    })

    return intersectingTiles.length === 0
  }
}
