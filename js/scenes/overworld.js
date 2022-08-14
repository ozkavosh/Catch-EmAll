class Overworld extends Phaser.Scene {
  currentState = false;

  constructor() {
    super({ key: "Overworld" });
  }

  preload() {
    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );
    this.load.image("tiles", "./img/tileset.png");
    this.load.tilemapTiledJSON("map", "./img/map.json");
    this.load.spritesheet("red", "./img/red-walk.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.cameras.main.setBounds(0, 0, 800, 600);
    this.physics.world.setBounds(0, 0, 800, 600);

    this.map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
    this.tileset = this.map.addTilesetImage("tileset", "tiles");
    this.groundLayer = this.map.createLayer("Suelo", this.tileset, 0, 0);
    this.treeLayer = this.map.createLayer("Arboles1", this.tileset, 0, 0);
    this.grassLayer = this.map.createLayer("Hierba", this.tileset, 0, 0);
    this.treeLayer.setCollision([
      12, 13, 14, 46, 47, 108, 200, 201, 202, 706, 707, 708, 799, 800, 801, 802,
      803, 893, 894, 895, 896, 897, 988, 989, 990, 1082, 1083, 1084,
    ]);

    this.player = this.physics.add.sprite(350, 250, "red");
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("red", { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: "still",
      frames: [{ key: "red", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("red", { start: 5, end: 8 }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("red", { start: 9, end: 12 }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("red", { start: 13, end: 16 }),
      frameRate: 4,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.physics.add.collider(this.player, this.treeLayer);
    this.physics.add.overlap(
      this.player,
      this.grassLayer,
      this.standingOnGrass,
      null,
      this
    );
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-150);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(150);
      this.player.anims.play("right", true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-150);
      this.player.anims.play("up", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(150);
      this.player.anims.play("down", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("still");
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
      newPokemon.catches += poke.catches;
    }

    await axios.post(
      `https://ch-simple-login.glitch.me/api/data/`,
      newPokemon,
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      }
    );
  }

  async standingOnGrass() {
    let tile = this.grassLayer.getTileAtWorldXY(
      this.player.x,
      this.player.y,
      true
    );
    if (tile.index == 7 && !this.currentState) {
      this.currentState = true;
      const randomNumber = Math.floor(Math.random() * 100);
      if (randomNumber <= 10) {
        const randomPokemonId = Math.floor(Math.random() * (600 - 1) + 1);
        const request = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
        );
        const response = request.data;
        await this.catchPokemon(response);
        const dialog = document.querySelector(".dialogCatch");
        const dialogContent = dialog.querySelector(".dialog-content");
        const dialogImg = dialog.querySelector(".dialog-img");
        dialogContent.innerText = `Encontraste un ${response.name} en la hierba!`;
        dialogImg.setAttribute("src", response.sprites.front_default);
        dialog.showModal();
      }
    } else if (tile.index !== 7) {
      this.currentState = false;
    }
  }
}

export default Overworld;
