import { ctx } from "../util/global";

export class Block {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    const boxPoy = innerHeight;
    const boxHeight = 30;
    this.x = x;
    this.y = boxPoy - boxHeight * y;
    this.width = width;
    this.height = boxHeight * height;
  }

  draw(centerX: number) {
    ctx.fillRect(this.x + centerX, this.y, this.width, this.height);
  }
}
