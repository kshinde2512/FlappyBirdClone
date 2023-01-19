import Phaser from 'phaser';
import PreloadScene from './Scenes/PreloadScene';
import PlayScene from './Scenes/PlayScene';
import MenuScene from './Scenes/MenuScene';
import ScoreScene from './Scenes/ScoreScene';
import PauseScene from './Scenes/PauseScene';

const WIDTH = 500;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
};

const SCENES = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];
const createScene = (Scene) => new Scene(SHARED_CONFIG);
const initScenes = () => SCENES.map(createScene);

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
  },
  scene: initScenes(),
};

new Phaser.Game(config);
