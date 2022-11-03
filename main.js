class SnakeBody
{
  constructor(x, y) {
    this.body = [createVector(x, y)];
  }

  head() {
    return this.body[this.count() - 1];
  }

  count() {
    return this.body.length;
  }

  get(index) {
    return this.body[index];
  }

  grow() {
    const tail = this.head().copy();
    this.body.push(tail);
  }

  moveRight() {
    const tail = this.head().copy();
    this.body.shift();
    tail.x += 1;
    this.body.push(tail);
  }

  moveLeft() {
    const tail = this.head().copy();
    this.body.shift();
    tail.x -= 1;
    this.body.push(tail);
  }

  moveUp() {
    const tail = this.head().copy();
    this.body.shift();
    tail.y -= 1;
    this.body.push(tail);
  }

  moveDown() {
    const tail = this.head().copy();
    this.body.shift();
    tail.y += 1;
    this.body.push(tail);
  }

  touchedHimself() {
    const head = this.head();
    for (let i = 0; i < this.body.length - 1; i++) {
      const part = this.body[i];
      if (head === part) {
        continue;
      }
      if (head.x === part.x && head.y === part.y) {
        return true;
      }
    }
    return false;
  }
}

class Snake
{
  static Direction = {
    right: 1,
    left: 2,
    up: 3,
    down: 4
  };

  constructor(x, y) {
    this.direction = Snake.Direction.right;
    this.body = new SnakeBody(x, y);
  }

  grow() {
    this.body.grow();
  }

  draw() {
    push();
    noStroke("red");
    for (let i = 0; i < this.body.count(); i++) {
      const body = this.body.get(i);
      fill(["red", "blue", "green"][i % 3]);
      rect(body.x, body.y, 1, 1);
    }
    pop();
  }

  move() {
    switch (this.direction) {
      case Snake.Direction.right:
        this.body.moveRight();
        break;
      case Snake.Direction.left:
        this.body.moveLeft();
        break;
      case Snake.Direction.up:
        this.body.moveUp();
        break;
      case Snake.Direction.down:
        this.body.moveDown();
        break;
    }
  }

  score() {
    return this.body.count();
  }

  toRight() {
    if (this.direction === Snake.Direction.left) {
      return;
    }
    this.direction = Snake.Direction.right;
  }

  toLeft() {
    if (this.direction === Snake.Direction.right) {
      return;
    }
    this.direction = Snake.Direction.left;
  }

  toUp() {
    if (this.direction === Snake.Direction.down) {
      return;
    }
    this.direction = Snake.Direction.up;
  }

  toDown() {
    if (this.direction === Snake.Direction.up) {
      return;
    }
    this.direction = Snake.Direction.down;
  }
}

class GameBoard
{
  constructor(width, height) {
    this.snake = new Snake(0, 0);
    this.width = width;
    this.height = height;
    this.spawnFood();
  }

  randomLocation() {
    const x = floor(random(this.width));
    const y = floor(random(this.height));
    return createVector(x, y);
  }

  spawnFood() {
    this.food = this.randomLocation();
  }

  drawFood() {
    push();
    noStroke();
    fill("blue");
    rect(this.food.x, this.food.y, 1);
    pop();
  }

  handleInput(key) {
    if (key === "h") {
      this.snake.toLeft();
    }

    if (key === "l") {
      this.snake.toRight();
    }

    if (key === "k") {
      this.snake.toUp();
    }

    if (key === "j") {
      this.snake.toDown();
    }
  }

  run() {
    if (this.isSnakeHeadTouchedFood()) {
      this.snake.grow();
      this.spawnFood();
    }
    this.snake.move();
    this.snake.draw();
    this.drawFood();


    this.drawResult();
  }

  isSnakeHeadTouchedFood() {
    const head = this.snake.body.head();
    const food = this.food;
    return head.x === food.x && head.y === food.y;
  }

  drawResult() {
    push();
    noStroke();
    fill("red");
    textSize(5);
    text(this.snake.score(), 0, this.height - 2);
    pop();
  }

  shouldEndGame() {
    const body = this.snake.body;
    const head = body.head();
    return (
      (head.x > this.width - 1 || head.x < 0) || (head.y >= this.height - 1 || head.y < 0)
      ||
      body.touchedHimself()
    );
  }
}

let game;
let resolution;

function setup() {
  const w = windowWidth / 2;
  const h = windowHeight / 2;
  createCanvas(w, h).style("display", "block").style("margin", "10vh auto");
  resolution = windowWidth / 100;
  frameRate(5);
  game = new GameBoard(floor(w / resolution), floor(h / resolution));
}

function draw() {
  scale(resolution);
  background(0xaa);
  if (game.shouldEndGame()) {
    background(0x00);
    noLoop();
  }
  game.run();
}

function keyPressed() {
  game.handleInput(key);
}
