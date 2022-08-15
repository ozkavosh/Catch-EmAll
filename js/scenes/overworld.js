class Overworld extends Phaser.Scene {
  modalShowing = false;

  constructor() {
    super({ key: "Overworld" });
  }

  preload() {
    this.load.image("tiles", "./img/tileset.png");
    this.load.tilemapTiledJSON("map", "./img/map.json");
    this.load.spritesheet("player", "./img/red-walk.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.overworldTileMap = this.make.tilemap({ key: "map" });
    this.overworldTileMap.addTilesetImage("tileset", "tiles");
    for (let i = 0; i < this.overworldTileMap.layers.length; i++) {
      const layer = this.overworldTileMap.createLayer(i, "tileset", 0, 0);
      layer.scale = 3;
    }

    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.scale = 1.5;
    playerSprite.setFrame(this.getStopFrame("down"));
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    this.createPlayerAnimation("up", 9, 12);
    this.createPlayerAnimation("right", 5, 8);
    this.createPlayerAnimation("down", 13, 16);
    this.createPlayerAnimation("left", 0, 3);

    this.cursors = this.input.keyboard.createCursorKeys();

    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          startPosition: { x: 8, y: 10 },
        },
      ],
    };

    this.gridEngine.create(this.overworldTileMap, gridEngineConfig);

    this.gridEngine.movementStarted().subscribe(({ direction }) => {
      playerSprite.anims.play(direction);
    });

    this.gridEngine.movementStopped().subscribe(({ direction }) => {
      playerSprite.anims.stop();
      playerSprite.setFrame(this.getStopFrame(direction));
    });

    this.gridEngine.directionChanged().subscribe(({ direction }) => {
      playerSprite.setFrame(this.getStopFrame(direction));
    });

    this.gridEngine
      .positionChangeFinished()
      .subscribe(({ charId, exitTile, enterTile }) => {
        if (this.hasTrigger(this.overworldTileMap, enterTile)) {
          this.standingOnGrass();
        }
      });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.gridEngine.move("player", "left");
    } else if (this.cursors.right.isDown) {
      this.gridEngine.move("player", "right");
    } else if (this.cursors.up.isDown) {
      this.gridEngine.move("player", "up");
    } else if (this.cursors.down.isDown) {
      this.gridEngine.move("player", "down");
    }
  }

  createPlayerAnimation(name, startFrame, endFrame) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers("player", {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 4,
      repeat: -1,
      yoyo: true,
    });
  }

  getStopFrame(direction) {
    switch (direction) {
      case "up":
        return 9;
      case "right":
        return 5;
      case "down":
        return 4;
      case "left":
        return 0;
    }
  }

  async catchPokemon(pokemon) {
    const request = await axios.get(
      "https://ch-simple-login.glitch.me/api/data/",
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      }
    );

    const pokemonList = request.data;
    const newPokemon = {
      name: pokemon.name,
      pid: pokemon.id,
      sprite: pokemon.sprites.front_default,
      catches: 1,
    };

    if (pokemonList.some((poke) => poke.pid == pokemon.id)) {
      const poke = pokemonList.find((poke) => poke.pid == pokemon.id);
      newPokemon.catches += poke.catches;

      await axios.put(
        `https://ch-simple-login.glitch.me/api/data/${poke.id}`,
        newPokemon,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
    } else {
      await axios.post(
        `https://ch-simple-login.glitch.me/api/data/`,
        newPokemon,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
    }
  }

  hasTrigger(tilemap, position) {
    return tilemap.layers.some((layer) => {
      const tile = tilemap.getTileAt(position.x, position.y, false, layer.name);
      return tile?.properties?.trigger;
    });
  }

  playerStop(){
    this.cursors.up.isDown = false;
    this.cursors.left.isDown = false;
    this.cursors.right.isDown = false;
    this.cursors.down.isDown = false;
  }

  async standingOnGrass() {
    const randomNumber = Math.floor(Math.random() * 100);
    if (randomNumber <= 10 && !this.modalShowing) {
      this.modalShowing = true;
      this.playerStop();
      this.input.keyboard.enabled = false;
      const randomPokemonId = Math.floor(Math.random() * (600 - 1) + 1);
      const request = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
      );
      const response = request.data;
      await this.catchPokemon(response);
      const dialog = document.querySelector(".dialogCatch");
      const form = dialog.querySelector("form");
      const dialogContent = dialog.querySelector(".dialog-content");
      const dialogImg = dialog.querySelector(".dialog-img");
      dialogContent.innerText = `Encontraste un ${response.name} en la hierba!`;
      dialogImg.setAttribute("src", response.sprites.front_default);
      dialog.showModal();

      form.addEventListener("submit", () => {
        this.input.keyboard.enabled = true;
        this.modalShowing = false;
      });
    }
  }
}

export default Overworld;
