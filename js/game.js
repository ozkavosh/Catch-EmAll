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
  
  Swal.fire("Instrucciones","Utiliza las flechas para moverte.\nBusca Pokemones en la hierba!", "info");
};

window.addEventListener("load", () => showInstructions());
