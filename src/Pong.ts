import "phaser";

import { IKeyboard } from "./Keyboard";

export default class Pong extends Phaser.Scene {
  private _player1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _player2: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _keys: IKeyboard = {};
  private _gameStarted: boolean;
  private _openingText: Phaser.GameObjects.Text;
  private _player1Score: number;
  private _player2Score: number;
  private _player1ScoreText: Phaser.GameObjects.Text;
  private _player2ScoreText: Phaser.GameObjects.Text;
  private _centerx;
  private _centery;
  constructor() {
    super("pong");
  }

  preload() {
    this.load.image("paddle", "assets/paddle.png");
    this.load.image("ball", "assets/ball.png");
  }

  create() {
    this._centerx = this.physics.world.bounds.width / 2;
    this._centery = this.physics.world.bounds.height / 2;
    this._player1Score = this._player2Score = 0;
    this._ball = this.physics.add.sprite(
      this._centerx, // x position
      this._centery, // y position
      "ball" // key of image for the sprite
    );
    this._ball.setVisible(false);
    this._player1 = this.physics.add.sprite(
      this.physics.world.bounds.width - (this._ball.body.width / 2 + 1), // x position
      this.physics.world.bounds.height / 2, // y position
      "paddle" // key of image for the sprite
    );

    this._player2 = this.physics.add.sprite(
      this._ball.body.width / 2 + 1, // x position
      this.physics.world.bounds.height / 2, // y position
      "paddle" // key of image for the sprite
    );

    this._cursors = this.input.keyboard.createCursorKeys();
    this._keys.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this._keys.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    this._player1.setCollideWorldBounds(true);
    this._player2.setCollideWorldBounds(true);
    this._ball.setCollideWorldBounds(true);
    this._ball.setBounce(1, 1);
    this._player1.setImmovable(true);
    this._player2.setImmovable(true);
    this.physics.add.collider(this._ball, this._player1, this.hitPlayer, null, this);
    this.physics.add.collider(this._ball, this._player2, this.hitPlayer, null, this);

    this._openingText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      "Press SPACE to Start",
      {
        fontFamily: "Monaco, Courier, monospace",
        fontSize: "50px",
        color: "#fff",
      }
    );

    this._openingText.setOrigin(0.5);

    // Create player 1 victory text
    this._player1ScoreText = this.add.text(
      this.physics.world.bounds.width * 0.25,
      this.physics.world.bounds.height / 2,
      "Player 1: 0",
      {
        fontFamily: "Monaco, Courier, monospace",
        fontSize: "50px",
        color: "#fff",
      }
    );

    this._player1ScoreText.setOrigin(0.5);

    // Make it invisible until the player loses
    this._player1ScoreText.setVisible(true);

    // Create the game won text
    this._player2ScoreText = this.add.text(
      this.physics.world.bounds.width * 0.75,
      this.physics.world.bounds.height / 2,
      "Player 2: 0",
      {
        fontFamily: "Monaco, Courier, monospace",
        fontSize: "50px",
        color: "#fff",
      }
    );

    this._player2ScoreText.setOrigin(0.5);

    // Make it invisible until the player wins
    this._player2ScoreText.setVisible(true);
  }

  update(time: number, delta: number): void {
    if (this.isPlayer1Point()) {
      this.scorePlayer1();
      //this._ball.disableBody(true, true);
      return;
    }
    if (this.isPlayer2Point()) {
      this.scorePlayer2();
      //this._ball.disableBody(true, true);
      return;
    }

    this._player1.body.setVelocityY(0);
    this._player2.body.setVelocityY(0);

    if (this._cursors.up.isDown) {
      this._player1.body.setVelocityY(-350);
    } else if (this._cursors.down.isDown) {
      this._player1.body.setVelocityY(350);
    }
    // TODO: Allow player to move forward

    if (this._keys.w.isDown) {
      this._player2.body.setVelocityY(-350);
    } else if (this._keys.s.isDown) {
      this._player2.body.setVelocityY(350);
    }
    // TODO: Allow player to move forward

    if (!this._gameStarted) {
      if (this._cursors.space.isDown) {
        this._ball.setVisible(true);
        this._gameStarted = true;
        const initialXSpeed = Math.random() * 200 + 50;
        const initialYSpeed = Math.random() * 200 + 50;
        this._ball.setVelocityX(initialXSpeed);
        this._ball.setVelocityY(initialYSpeed);       
        this._openingText.setVisible(false);
      }
    }
  }
  isPlayer1Point() {
    return this._ball.body.x < this._player2.body.x;
  }

  isPlayer2Point() {
    return this._ball.body.x > this._player1.body.x;
  }

  hitPlayer(
    ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    console.log(
      `Hit Player! x:${player.body.position.x}, y:${player.body.position.y}`
    );
    console.log(
      `Ball position x:${ball.body.position.x}, y:${ball.body.position.y}`
    );
  }

  reset() {
    this._gameStarted = false;
    this._player1.body.setVelocityY(0);
    this._player2.body.setVelocityY(0);
    this._ball.setPosition( this._centerx, this._centery);
  }

  scorePlayer1() {
    this.reset();
    this._player1Score++;
    console.log(`Player 1 score is: ${this._player1Score}`);
    this._player1ScoreText.setText(`Player 1: ${this._player1Score}`);
  }
  scorePlayer2() {
    this.reset();
    this._player2Score++;
    console.log(`Player 2 score is: ${this._player2Score}`);
    this._player2ScoreText.setText(`Player 2: ${this._player2Score}`);
  }
}
