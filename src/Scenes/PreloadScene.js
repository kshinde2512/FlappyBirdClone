import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }
  preload() {
    this.load.image('Sky', 'assets/sky.png');
    this.load.spritesheet('Bird', 'assets/birdSprite.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    //this.load.image('Bird', 'assets/bird.png');
    this.load.image('Pipe', 'assets/pipe.png');
    this.load.image('Pause', 'assets/pause.png');
    this.load.image('Back', 'assets/back.png');
  }
  create() {
    this.scene.start('MenuScene');
  }
}

export default PreloadScene;
