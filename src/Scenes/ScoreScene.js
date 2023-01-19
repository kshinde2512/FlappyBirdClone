import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {
  constructor(config) {
    super('ScoreScene', { ...config, canGoBack: true });
  }
  create() {
    super.create();
    this.displayBestScore();
  }

  displayBestScore() {
    const bestScore = localStorage.getItem('bestScore');
    this.add
      .text(
        ...this.screenCenter,
        `Your high Score is ${bestScore || 0}`,
        this.fontOptions
      )
      .setOrigin(0.5);
  }
}

export default ScoreScene;
