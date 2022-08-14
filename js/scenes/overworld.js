class Overworld extends Phaser.Scene {
  constructor() {
    super({key: 'Overworld'});
  }

  preload() {
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
    this.physics.add.overlap(this.player, this.grassLayer, this.standingOnGrass, null, this);
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

  standingOnGrass(){
    let tile = this.grassLayer.getTileAtWorldXY(this.player.x, this.player.y, true);
        if (tile.index == 7) {
            console.log('Esta pisando el pasto!!!');
        }
  }
}

export default Overworld;
