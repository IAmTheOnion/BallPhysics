const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ballPosLabel = document.getElementById("ballPos");

const balls = [];
const lines = [];

let mouseX = 300;
let mouseY = 300;



canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect(); // Pobranie prostokąta zawierającego canvas
  mouseX = event.clientX - rect.left; // Współrzędna x względem canvas
  mouseY = event.clientY - rect.top; // Współrzędna y względem canvas
  ballPosLabel.innerHTML = `x: ${mouseX}, y: ${mouseY}`;
  // Tutaj możesz wykorzystać x i y do wykonania operacji na kliknięciu
});

function drawLine(line) {
  ctx.beginPath();
  ctx.moveTo(line.x1, line.y1);
  ctx.lineTo(line.x2, line.y2);
  ctx.strokeStyle = line.color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function drawTrail(ball) {
  for (let i = 0; i < ball.trail.length - 1; i++) {
    ctx.globalAlpha = i / ball.trail.length;
    ctx.beginPath();
    ctx.moveTo(ball.trail[i].x, ball.trail[i].y);
    ctx.lineTo(ball.trail[i + 1].x, ball.trail[i + 1].y);
    ctx.strokeStyle = ball.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }
  ctx.globalAlpha = 1;
}

function updatePosition(ball) {
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }

  if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else {
    ball.dy += ball.gravity;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  ball.trail.push({
    x: ball.x,
    y: ball.y
  });

  if (ball.trail.length > 10) {
    ball.trail.shift();
  }
}

function checkLineCollision(ball, line) {
  const x1 = line.x1;
  const y1 = line.y1;
  const x2 = line.x2;
  const y2 = line.y2;
  const px = ball.x;
  const py = ball.y;
  const d = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
  const u = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / (d * d);
  if (u >= 0 && u <= 1) {
    const x = x1 + u * (x2 - x1);
    const y = y1 + u * (y2 - y1);
    const distance = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
    return distance < ball.radius;
  }
  return false;
}

function handleCollisions() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].trail.push({
      x: balls[i].x,
      y: balls[i].y
    });
    for (let j = i + 1; j < balls.length; j++) {
      if (checkCollision(balls[i], balls[j])) {
        const tempDx = balls[i].dx;
        balls[i].dx = balls[j].dx;
        balls[j].dx = tempDx;

        const tempDy = balls[i].dy;
        balls[i].dy = balls[j].dy;
        balls[j].dy = tempDy;
      }
    }
    for (let k = 0; k < lines.length; k++) {
      if (checkLineCollision(balls[i], lines[k])) {
        balls[i].dx = -balls[i].dx;
        balls[i].dy = -balls[i].dy;
      }
    }
  }
}

function checkCollision(ball1, ball2) {
  const dx = ball1.x - ball2.x;
  const dy = ball1.y - ball2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < ball1.radius + ball2.radius;
}

function addBall(event) {
  event.preventDefault();

  const ballColor = document.getElementById('ballColor').value;

  balls.push({
    x: mouseX,
    y: mouseY,
    dx: window.dx,
    dy: window.dy,
    radius: 10,
    gravity: 0.1,
    color: ballColor,
    trail: []
  });
}


function drawPositionAndDirection() {
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 4, 0, Math.PI*2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

document.getElementById('ballForm').addEventListener('submit', addBall);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const ball of balls) {
    updatePosition(ball);
    drawBall(ball);
    drawTrail(ball);
  }

  for (const line of lines) {
    drawLine(line);
  }
  drawPositionAndDirection();
  handleCollisions();

  requestAnimationFrame(animate);
}

animate();
