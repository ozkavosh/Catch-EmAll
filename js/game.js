import Overworld from "./scenes/overworld.js";

const config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  disableContextMenu: true,
  physics: {
    default: "arcade",
  },
  scene: [Overworld],
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
};

const game = new Phaser.Game(config);

const showInstructions = () => {
  if(!sessionStorage.getItem("token")){
    return location.href = "./login.html";
  }
  const dialog = document.querySelector(".dialogInstructions");
  dialog.showModal();
};

window.addEventListener("load", () => showInstructions());
