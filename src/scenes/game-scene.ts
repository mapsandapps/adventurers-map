export class GameScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.image("logo", "./src/assets/phaser.png");
  }

  create(): void {
    this.phaserSprite = this.add.sprite(400, 300, "logo");
  }
}
