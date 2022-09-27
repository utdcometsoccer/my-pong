import "phaser";

import Pong from "./Pong";

function GameLoad(height: number, width: number) {
  new Phaser.Game( {
    type: Phaser.AUTO,
    backgroundColor: "#125555",
    width: width,
    height: height,
    scene: Pong,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade"
    },
  });
}
GameLoad(600, 800);
