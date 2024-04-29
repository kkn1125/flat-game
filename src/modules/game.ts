import { APP, canvas, ctx } from "../util/global";
import { Block } from "./block";
// import { GameMap } from "./gamemap";
import { Player } from "./player";

class Joystick {
  left: boolean = false;
  right: boolean = false;
  up: boolean = false;
  down: boolean = false;
}

export class Game {
  player: Player;
  blocks: Block[] = [];
  // gameMap: GameMap;

  joystick: Joystick = new Joystick();

  private centerX!: number;
  private viewLimit!: [number, number];
  private mapLimit!: [number, number];
  overflow: number = 0;

  constructor() {
    this.player = new Player(100, 400);
    // this.gameMap = new GameMap();
    this.bindEvents();
    this.blocks.push(new Block(100, 3, 150, 1));
    this.blocks.push(new Block(350, 5, 150, 1));
    this.blocks.push(new Block(600, 7, 30, 1));
    this.blocks.push(new Block(760, 4, 150, 1));
    this.blocks.push(new Block(780, 7, 50, 1));
    this.blocks.push(new Block(900, 10, 350, 1));
    this.blocks.push(new Block(730, 13, 550, 1));
    this.blocks.push(new Block(1000, 5, 1000, 1));

    const max =
      Math.max(
        ...this.blocks
          .map((item) => item.x + item.width)
          .toSorted((a, b) => b - a)
      ) + 50;
    this.mapLimit = [50, max];
    this.viewLimit = [canvas.width * 0.45, max - canvas.width * 0.45];
    /* 맵 한계 패딩 값 */
    this.centerX =
      this.player.x < this.viewLimit[0]
        ? 25
        : this.player.x > this.viewLimit[1]
        ? this.viewLimit[1] - canvas.width
        : canvas.width / 2 - this.player.x - this.player.width + 50;
  }

  bindEvents() {
    APP.append(canvas);
    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));
    document.addEventListener("keydown", this.handleKeydown.bind(this));
    document.addEventListener("keyup", this.handleKeyup.bind(this));
  }

  handleKeydown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (key === "arrowleft") {
      this.joystick.left = true;
    }
    if (key === "arrowright") {
      this.joystick.right = true;
    }
    if (key === "arrowup") {
      this.joystick.up = true;
    }
    if (key === "arrowdown") {
      this.joystick.down = true;
    }
  }

  handleKeyup(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (key === "arrowleft") {
      this.joystick.left = false;
    }
    if (key === "arrowright") {
      this.joystick.right = false;
    }
    if (key === "arrowup") {
      this.joystick.up = false;
    }
    if (key === "arrowdown") {
      this.joystick.down = false;
    }
  }

  handleResize() {
    console.log("resize");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }

  update() {
    if (this.mapLimit[0] < this.player.x) {
      if (this.joystick.left) {
        // if (this.gameMap.limit[0] < this.player.x) {
        this.player.moveLeft();
        // }
      }
    }
    if (this.mapLimit[1] > this.player.x + this.player.width) {
      if (this.joystick.right) {
        // if (this.player.x + this.player.width < this.gameMap.limit[1]) {
        this.player.moveRight();
        // }
      }
    }
    if (this.joystick.up) {
      this.player.jump();
    }

    if (this.viewLimit[0] < this.player.x + this.player.velocityX) {
      this.centerX -= this.player.velocityX;
    }
    if (
      this.player.x + this.player.width + this.player.velocityX >
      this.viewLimit[1]
    ) {
      this.centerX += this.player.velocityX;
    }
    this.player.update(this.blocks);

    if (this.joystick.left || this.joystick.right) {
      this.player.stop();
    }
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // this.gameMap.drawFixed(
    //   this.centerX + this.overflow,
    //   this.player.x + this.player.width / 2
    // );
    // this.gameMap.draw();
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      block.draw(this.centerX);
    }

    this.player.drawFixed(this.centerX);

    ctx.strokeStyle = "#ccc";

    ctx.textAlign = "left";
    ctx.fillText(
      "< left limit",
      this.mapLimit[0] + this.centerX,
      canvas.height / 2
    );
    ctx.beginPath();
    ctx.moveTo(this.mapLimit[0] + this.centerX, 0);
    ctx.lineTo(this.mapLimit[0] + this.centerX, canvas.height + 0);
    ctx.stroke();

    ctx.textAlign = "right";
    ctx.fillText(
      "right limit >",
      this.mapLimit[1] + this.centerX,
      canvas.height / 2
    );
    ctx.beginPath();
    ctx.moveTo(this.mapLimit[1] + this.centerX, 0);
    ctx.lineTo(this.mapLimit[1] + this.centerX, canvas.height + 0);
    ctx.stroke();
  }

  run() {
    requestAnimationFrame(() => this.run());
    this.update();
    this.draw();
  }
}
