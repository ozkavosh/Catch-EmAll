class Overworld extends Phaser.Scene {
  modalShowing = false;

  constructor() {
    super({ key: "Overworld" });
  }

  preload() {
    this.load.image("tiles", "./img/tileset.png");
    this.load.tilemapTiledJSON("map", "./img/map.json");
    this.load.spritesheet("player", "./img/frani-walk.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("npc1", "./img/red-walk.png", {
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

    const npcSprite = this.add.sprite(0, 0, "npc1");
    npcSprite.scale = 1.5;
    npcSprite.setFrame(this.getStopFrame("down"));
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    this.createPlayerAnimation("player", "up", 9, 12);
    this.createPlayerAnimation("player", "right", 5, 8);
    this.createPlayerAnimation("player", "down", 13, 16);
    this.createPlayerAnimation("player", "left", 0, 3);

    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          startPosition: { x: 8, y: 10 },
        },
        {
          id: "npc1",
          sprite: npcSprite,
          startPosition: { x: 12, y: 5 },
          speed: 1.5,
          walkingAnimationMapping: {
            up: {
              leftFoot: 12,
              standing: 9,
              rightFoot: 10,
            },
            down: {
              leftFoot: 14,
              standing: 13,
              rightFoot: 16,
            },
            left: {
              leftFoot: 1,
              standing: 0,
              rightFoot: 3,
            },
            right: {
              leftFoot: 6,
              standing: 5,
              rightFoot: 8,
            },
          },
        },
      ],
    };

    this.gridEngine.create(this.overworldTileMap, gridEngineConfig);

    this.gridEngine.movementStarted().subscribe(({ charId, direction }) => {
      if (charId === "player") {
        playerSprite.anims.play(direction);
      }
    });

    this.gridEngine.movementStopped().subscribe(({ charId, direction }) => {
      if (charId === "player") {
        playerSprite.anims.stop();
        playerSprite.setFrame(this.getStopFrame(direction));
      }
    });

    this.gridEngine.directionChanged().subscribe(({ charId, direction }) => {
      if (charId === "player") {
        playerSprite.setFrame(this.getStopFrame(direction));
      }
    });

    this.gridEngine
      .positionChangeFinished()
      .subscribe(({ charId, exitTile, enterTile }) => {
        if (
          charId == "player" &&
          this.hasTrigger(this.overworldTileMap, enterTile)
        ) {
          this.standingOnGrass();
        }
      });

    this.gridEngine.moveRandomly("npc1");
  }

  update() {
    this.cursors = this.input.keyboard.createCursorKeys();

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

  createPlayerAnimation(spriteName, name, startFrame, endFrame) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers(spriteName, {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 4,
      repeat: -1,
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

  playerStop() {
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

      await Swal.fire({
        title: "Atencion!",
        iconHtml: `<img src="${response.sprites.front_default}" alt="${response.name}"/>`,
        text: `Encontraste un ${response.name} salvaje!`,
      });

      this.input.keyboard.enabled = true;
      this.modalShowing = false;
    }
  }
}

export default Overworld;
