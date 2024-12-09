const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

/* Configuration and variables */

const config = {
  width: window.innerWidth,
  height: window.innerHeight,
  middleX: window.innerWidth / 2,
  middleY: window.innerHeight / 2,
  velocity: 3,
  auto: false,
  snakeLength: 3,
  appleCalorie: 0.5,
  tendonsDistance: 10,
  colors: {
    snake: "#118A17",
    apple: "#E63F0C",
  },
};

class Point {
  constructor(x, y) {
    this.x = x || config.middleX;
    this.y = y || config.middleY;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}

const mouseCoords = new Point();

/* Drawing snake */

class Snake {
  constructor() {
    this.tail = [];
    this.radius = 10;
    for (let i = 0; i < config.snakeLength; i++) {
      this.tail[i] = new Point();
    }
  }

  draw() {
    this.tail.forEach((point, index) => {
      const prev = index === 0 ? (config.auto ? apple : mouseCoords) : this.tail[index - 1];

      let deltaX = prev.x - point.x;
      let deltaY = prev.y - point.y;

      const vectorLength = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      let dx = (deltaX / vectorLength) * config.velocity || 0;
      let dy = (deltaY / vectorLength) * config.velocity || 0;

      if (vectorLength > config.tendonsDistance) {
        point.set(point.x + dx, point.y + dy);
      }

      if (index === 0) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.quadraticCurveTo(prev.x, prev.y, (point.x + prev.x) / 2, (point.y + prev.y) / 2);
      }
      ctx.lineCap = "round";
      ctx.strokeStyle = config.colors.snake;
      ctx.lineWidth = snake.radius;
      ctx.stroke();
    });
  }

  grow() {
    this.tail.push(new Point(snake.tail[snake.tail.length - 1].x, snake.tail[snake.tail.length - 1].y));
    this.radius += config.appleCalorie;
  }
}

const snake = new Snake();

/* Apple */

class Apple {
  constructor() {
    this.x = Math.floor(Math.random() * config.width);
    this.y = Math.floor(Math.random() * config.height);
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = config.colors.apple;
    ctx.arc(this.x, this.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  eat() {
    if (Math.abs(this.x - snake.tail[0].x) < 20 && Math.abs(this.y - snake.tail[0].y) < 20) {
      this.x = Math.floor(Math.random() * config.width);
      this.y = Math.floor(Math.random() * config.height);
      snake.grow();
    }
  }
}

const apple = new Apple();

/* Dash */

window.addEventListener("mousedown", () => {
  config.velocity = 4;
});

window.addEventListener("mouseup", () => {
  config.velocity = 3;
});

/* Frame update */

function tick(t) {
  ctx.clearRect(0, 0, config.width, config.height);
  snake.draw();
  apple.draw();
  apple.eat();
  window.requestAnimationFrame(tick);
}

tick(0);

/* Canvas */

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

setupCanvas();
window.addEventListener("resize", setupCanvas);

/* On Mouse move */

window.addEventListener("click", (e) => {
  mouseCoords.set(e.pageX, e.pageY);
});
window.addEventListener("mousemove", (e) => {
  mouseCoords.set(e.pageX, e.pageY);
});
window.addEventListener("touchmove", (e) => {
  mouseCoords.set(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});
