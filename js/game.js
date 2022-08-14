import Overworld from './scenes/overworld.js';

const config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  disableContextMenu: true,
  physics: {
    default: "arcade",
  },
  scene: [Overworld]
};

const game = new Phaser.Game(config);

const showInstructions = () => {
  const dialog = document.querySelector(".dialogInstructions");
  dialog.showModal();
}

window.addEventListener('load', () => showInstructions());
