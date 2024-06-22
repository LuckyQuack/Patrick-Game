class mainScene {

    preload() {
        this.load.image('player', '/assets/player.png');
        this.load.image('coin', '/assets/patty.png');
        this.load.image('monster', '/assets/monster.png');
    }

    create() {
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.coin = this.physics.add.sprite(300, 300, 'coin');

        this.monsters = this.physics.add.group();
        this.monsters.add(this.physics.add.sprite(200, 300, 'monster'));
        this.monsters.add(this.physics.add.sprite(500, 200, 'monster'));

        this.score = 0;

        let style = { font: '20px Arial', fill: '#fff' };

        this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);

        this.arrow = this.input.keyboard.createCursorKeys();

        this.monsterSpeed = 100;
        this.monsters.children.iterate(monster => {
            this.setMonsterVelocity(monster);
        });

        this.time.addEvent({
            delay: 1000, // 1 second
            callback: this.updateMonsterVelocities,
            callbackScope: this,
            loop: true
        });

        // Set world bounds
        this.physics.world.setBounds(0, 0, 700, 400);

        // Ensure the monsters collide with world bounds and bounce
        this.monsters.children.iterate(monster => {
            monster.setCollideWorldBounds(true);
            monster.setBounce(1);
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.scene.restart();
        });
    }

    update() {
        if (this.physics.overlap(this.player, this.coin)) {
            this.hit();
        }

        this.physics.overlap(this.player, this.monsters, this.monsterHit, null, this);

        if (this.arrow.right.isDown) {
            this.player.x += 3;
            this.player.setFlipX(false);
        } else if (this.arrow.left.isDown) {
            this.player.x -= 3;
            this.player.setFlipX(true);
        }

        if (this.arrow.down.isDown) {
            this.player.y += 3;
        } else if (this.arrow.up.isDown) {
            this.player.y -= 3;
        }

        if (this.score < 0) {
            this.gameOver();
        } else if (this.score >= 1000) {
            this.youWin();
        }
    }

    hit() {
        this.coin.x = Phaser.Math.Between(100, 600);
        this.coin.y = Phaser.Math.Between(100, 300);

        this.score += 10;

        this.scoreText.setText('score: ' + this.score);

        this.tweens.add({
            targets: this.player,
            duration: 200,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
        });
    }

    monsterHit(player, monster) {
        monster.x = Phaser.Math.Between(100, 600);
        monster.y = Phaser.Math.Between(100, 300);

        this.score -= 50;

        this.scoreText.setText('score: ' + this.score);

        this.tweens.add({
            targets: this.player,
            duration: 200,
            scaleX: 0.8,
            scaleY: 0.8,
            yoyo: true,
        });
    }

    setMonsterVelocity(monster) {
        let directions = [
            { x: this.monsterSpeed, y: 0 },   // Right
            { x: -this.monsterSpeed, y: 0 },  // Left
            { x: 0, y: this.monsterSpeed },   // Down
            { x: 0, y: -this.monsterSpeed },  // Up
            { x: this.monsterSpeed, y: this.monsterSpeed },    // Down-Right
            { x: this.monsterSpeed, y: -this.monsterSpeed },   // Up-Right
            { x: -this.monsterSpeed, y: this.monsterSpeed },   // Down-Left
            { x: -this.monsterSpeed, y: -this.monsterSpeed }   // Up-Left
        ];

        let randomDirection = directions[Phaser.Math.Between(0, directions.length - 1)];
        monster.setVelocity(randomDirection.x, randomDirection.y);
    }

    updateMonsterVelocities() {
        this.monsters.children.iterate(monster => {
            this.setMonsterVelocity(monster);
        });
    }

    gameOver() {
        this.physics.pause();
        this.add.text(350, 200, 'Game Over', { font: '40px Arial', fill: '#ff0000' }).setOrigin(0.5);
    }

    youWin() {
        this.physics.pause();
        this.add.text(350, 200, 'You Win!', { font: '40px Arial', fill: '#00ff00' }).setOrigin(0.5);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 700,
    height: 400,
    backgroundColor: '#3498db',
    scene: mainScene,
    physics: { default: 'arcade' },
    parent: 'game',
};

new Phaser.Game(config);