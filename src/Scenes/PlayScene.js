import BaseScene from './BaseScene';

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {
  constructor(config) {
    super('PlayScene', config);

    this.bird = null;
    this.pipes = null;
    this.isPaused = false;

    this.VELOCITY = 250;

    this.score = 0;
    this.scoreText = '';
    this.bestScore = '';

    this.currentDifficulty = 'easy';
    this.difficulties = {
      easy: {
        pipeVerticalDistanceRange: [150, 250],
        horizontalPipeDistanceRange: [300, 350],
      },
      normal: {
        pipeVerticalDistanceRange: [120, 180],
        horizontalPipeDistanceRange: [280, 310],
      },
      hard: {
        pipeVerticalDistanceRange: [120, 150],
        horizontalPipeDistanceRange: [250, 170],
      },
    };
  }

  create() {
    this.currentDifficulty = 'easy';
    super.create();
    this.createBird();
    this.createPipes();
    this.createPauseButton();
    this.createColliders();
    this.createScore();
    this.handleInput();
    this.listenEvents();

    this.anims.create({
      key: 'Fly',
      frames: this.anims.generateFrameNumbers('Bird', { start: 8, end: 15 }),
      frameRate: 8,
      //repeat infinitely
      repeat: -1,
    });

    this.bird.play('Fly');
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  listenEvents() {
    if (this.pauseEvent) {
      return;
    }
    this.pauseEvent = this.events.on('resume', () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(
          ...this.screenCenter,
          'Fly in ' + this.initialTime,
          this.fontOptions
        )
        .setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }
  countDown() {
    this.initialTime--;
    this.countDownText.setText('Fly in ' + this.initialTime);
    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText('');
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  createBG() {
    this.add.image(0, 0, 'Sky').setOrigin(0, 0);
  }

  createPauseButton() {
    this.isPaused = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, 'Pause')
      .setScale(3)
      .setOrigin(1);

    pauseButton.setInteractive();

    pauseButton.on('pointerdown', () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');
    });
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, 'Bird')
      .setFlipX('true')
      .setScale(2)
      .setOrigin(0);
    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.body.gravity.y = 400;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperpipe = this.pipes
        .create(0, 0, 'Pipe')
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerpipe = this.pipes
        .create(0, 0, 'Pipe')
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperpipe, lowerpipe);
      this.pipes.setVelocityX(-200);
    }
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem('bestScore');
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: '20px',
      fill: '#000',
    });
    this.bestScore = this.add.text(16, 50, `Best:  ${bestScore || 0}`, {
      fontSize: '20px',
      fill: '#000',
    });
  }
  handleInput() {
    this.input.on('pointerdown', this.flip, this);
    this.input.keyboard.on('keydown_SPACE', this.flip, this);
  }

  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
  }

  recyclePipes() {
    this.recyclePipes();
  }

  flip() {
    if (this.isPaused) {
      return;
    }
    this.bird.body.velocity.y = -this.VELOCITY;
  }

  placePipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    const rightmostX = this.getRightmostPipe();

    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.horizontalPipeDistanceRange
    );
    uPipe.x = rightmostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty() {
    if (this.score === 1) {
      this.currentDifficulty = 'normal';
    }
    if (this.score === 3) {
      this.currentDifficulty = 'hard';
    }
  }

  getRightmostPipe() {
    let rightmostX = 100;
    this.pipes.getChildren().forEach(function (pipe) {
      rightmostX = Math.max(pipe.x, rightmostX);
    });
    return rightmostX;
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem('bestScore', this.score);
    }
  }
  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xff0000);
    this.saveBestScore();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;
