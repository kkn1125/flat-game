import { canvas, ctx } from "../util/global";
import { Block } from "./block";

export class Player {
  x: number;
  y: number;
  width: number = 30;
  height: number = 30;
  velocityX: number = 0;
  velocityY: number = 0;
  speed: number = 3;
  gravity: number = 0.5;
  jumpPower: number = 10;
  isJumping: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(blocks: Block[]) {
    // Apply gravity
    let inAir = true;

    if (this.y + this.height + this.velocityY < canvas.height) {
      this.velocityY += this.gravity;
    } else {
      this.velocityY = 0;
      inAir = false;
      this.isJumping = false;
    }

    if (inAir) {
      this.isJumping = true;
    }

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      this.checkVerticalCollision(block);
      this.checkHorizontalCollision(block);
    }

    // Assume player is in the air unless collision detected

    // Check collision with each block
    // blocks.forEach((block) => {
    //   if (this.checkCollision(block)) {
    //     // Collision response depending on where the player hits the block
    //     const penetrationY = this.y + this.height - block.y;
    //     if (this.velocityY > 0 && penetrationY < this.height) {
    //       // Player hits the top of the block
    //       this.y = block.y - this.height;
    //       this.velocityY = 0;
    //       this.isJumping = false;
    //       inAir = false;
    //     }
    //   } else if (this.checkCollisionFloor()) {
    //     this.y = this.height;
    //     this.velocityY = 0;
    //     this.isJumping = false;
    //     inAir = false;
    //   }
    // });

    // Apply velocities

    this.x += this.velocityX;
    this.y += this.velocityY;

    // Reset vertical velocity if on ground and not jumping
    if (!inAir && !this.isJumping) {
      this.velocityY = 0;
    }
  }

  checkVerticalCollision(block: Block) {
    if (
      this.y + this.height + this.velocityY >= block.y &&
      this.y + this.height <= block.y + 1 &&
      this.x + this.width + this.velocityX >= block.x &&
      this.x + this.velocityX <= block.x + block.width
    ) {
      if (this.velocityY > 0) {
        this.velocityY = 0;
        this.y = block.y - this.height;
        this.isJumping = false;
      }
    }
  }

  checkHorizontalCollision(block: Block) {
    if (
      this.isJumping &&
      this.x + this.width > block.x &&
      this.x < block.x + block.width
    ) {
      return;
    }
    if (
      this.y + this.height + this.velocityY > block.y &&
      this.y + this.height < block.y + block.height &&
      this.x + this.width + this.velocityX >= block.x &&
      this.x + this.velocityX <= block.x + block.width
    ) {
      if (this.velocityX > 0) {
        // console.log("right collision");
        this.velocityX = 0;
        // this.x = block.x - this.width;
      }
      if (this.velocityX < 0) {
        // console.log("left collision");
        this.velocityX = 0;
        // this.x = block.x + block.width;
      }
    }
  }

  // checkCollisionFloor() {
  //   return this.y + this.height > innerHeight;
  // }

  // checkCollision(block: Block): boolean {
  //   // Simple AABB collision detection
  //   return (
  //     this.x < block.x + block.width &&
  //     this.x + this.width > block.x &&
  //     this.y < block.y + block.height &&
  //     this.y + this.height > block.y
  //   );
  // }

  // draw() {
  //   ctx.fillStyle = "blue";
  //   ctx.fillRect(this.x + innerWidth / 2, this.y, this.width, this.height);
  // }
  drawFixed(centerX: number) {
    ctx.fillStyle = "blue";
    // const halfSize = this.width / 2;
    ctx.fillRect(this.x + centerX, this.y, this.width, this.height);
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocityY = -this.jumpPower;
    }
  }

  moveLeft() {
    this.velocityX = -this.speed;
  }

  moveRight() {
    this.velocityX = this.speed;
  }

  stop() {
    this.velocityX = 0;
  }
}
