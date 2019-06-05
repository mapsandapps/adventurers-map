export class Enemy extends Phaser.GameObjects.Image {
  private timeToChangeDirection: number
  private line: Phaser.Geom.Line
  private speed: number

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame)

    this.line = new Phaser.Geom.Line()

    this.initContainer()
    this.scene.add.existing(this)
  }

  private initContainer() {
    this.timeToChangeDirection = 0
    this.speed = 100

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

  private changeDirection(): void {
    const possibleDirections = [
      { x: 0, y: 0, angle: 0 },
      { x: -1, y: 0, angle: 180 },
      { x: 1, y: 0, angle: 0 },
      { x: 0, y: -1, angle: 270 },
      { x: 0, y: 1, angle: 90 }
    ]
    let randomDirection = possibleDirections[Phaser.Math.Between(0, possibleDirections.length - 1)]
    this.body.setVelocity(randomDirection.x * this.speed, randomDirection.y * this.speed)
    this.angle = randomDirection.angle
  }

  update(): void {
    if (this.scene.time.now > this.timeToChangeDirection) {
      this.changeDirection()
      this.timeToChangeDirection = this.scene.time.now + 800
    }
  }
}
