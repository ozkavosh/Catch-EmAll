var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('map', './img/map.png');
    this.load.spritesheet('red', './img/red-walk.png', { frameWidth: 32, frameHeight: 48});
}

function create ()
{
    this.cameras.main.setBounds(0, 0, 800*2, 600*2);
    this.physics.world.setBounds(0,0, 800*2, 600*2);

    this.add.image(0, 0, 'map').setScale(4,4).setOrigin(0, 0);
    this.player = this.physics.add.sprite(800, 600, 'red').setScale(3,3);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('red', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'still',
        frames: [ { key: 'red', frame: 4 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('red', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('red', { start: 9, end: 12 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('red', { start: 13, end: 16 }),
        frameRate: 10,
        repeat: -1
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(this.player, true, 1, 1);
}

function update (){
    this.player.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-300);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(300);
            this.player.anims.play('right', true);
        }

        else if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-300);
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(300);
            this.player.anims.play('down', true);
        }else
        {
            this.player.setVelocityX(0);
        
            this.player.anims.play('still');
        }
}
