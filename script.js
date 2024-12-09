const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

/* Configuration and variables */

const config = {
  width: window.innerWidth,
  height: window.innerHeight,
  velocity: 3,
  snakeLength: 50,
  colors: {
    green: "#118a17",
  },
};

class Point {
  constructor(x, y) {
    this.x = x || config.width / 2;
    this.y = y || config.height / 2;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}

const mouseCoords = new Point();

/* Drawing snake */

const snake = [];
for (let i = 0; i < config.snakeLength; i++) {
  snake[i] = new Point();
}

const drawSnake = () => {
  snake.forEach((point, index) => {
    const prev = index === 0 ? mouseCoords : snake[index - 1];

    let deltaX = prev.x - point.x;
    let deltaY = prev.y - point.y;

    const vectorLength = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    let dx = (deltaX / vectorLength) * config.velocity || 0;
    let dy = (deltaY / vectorLength) * config.velocity || 0;

    if (vectorLength > 10) {
      point.set(point.x + dx, point.y + dy);
    }

    ctx.beginPath();
    ctx.fillStyle = config.colors.green;
    ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  });
};

/* Dash */

window.addEventListener("mousedown", () => {
  config.velocity += 2;
});

window.addEventListener("mouseup", () => {
  config.velocity -= 2;
});

/* Frame update */

function tick(t) {
  ctx.clearRect(0, 0, config.width, config.height);
  drawSnake();
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
