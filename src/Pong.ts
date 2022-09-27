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
  private _player1VictoryText: Phaser.GameObjects.Text;
  private _player2VictoryText: Phaser.GameObjects.Text;
  constructor() {
    super("pong");
  }

  preload() {
    this.load.image("paddle", "assets/paddle.png");
    this.load.image("ball", "assets/ball.png");
  }

  create() {
    this._ball = this.physics.add.sprite(
      this.physics.world.bounds.width / 2, // x position
      this.physics.world.bounds.height / 2, // y position
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
    this.physics.add.collider(this._ball, this._player1, null, null, this);
    this.physics.add.collider(this._ball, this._player2, null, null, this);

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
    this._player1VictoryText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      "Point for player 1!",
      {
        fontFamily: "Monaco, Courier, monospace",
        fontSize: "50px",
        color: "#fff",
      }
    );

    this._player1VictoryText.setOrigin(0.5);

    // Make it invisible until the player loses
    this._player1VictoryText.setVisible(false);

    // Create the game won text
    this._player2VictoryText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      "Point for player 2!",
      {
        fontFamily: "Monaco, Courier, monospace",
        fontSize: "50px",
        color: "#fff",
      }
    );

    this._player2VictoryText.setOrigin(0.5);

    // Make it invisible until the player wins
    this._player2VictoryText.setVisible(false);
  }

  update(time: number, delta: number): void {
    if (this.isPlayer1Point()) {
      this._player1VictoryText.setVisible(true);
      this._ball.disableBody(true, true);
      return;
    }
    if (this.isPlayer2Point()) {
      this._player2VictoryText.setVisible(true);
      this._ball.disableBody(true, true);
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

  hitPlayer(ball, player) {
    // custom logic for changing ball x or y velocity
  }
}
