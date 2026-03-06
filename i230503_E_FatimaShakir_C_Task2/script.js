//DOM ELEMENTS
const target = document.getElementById("innerBox");
const outer = document.querySelector(".outer");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let timerInterval;
let speed = 1.5;

let direction = 1;
let currentY = 0;
let animationFrame;

const smoothMoveTarget = () => {

    if (!gameRunning) return;

    const maxY = outer.clientHeight - target.clientHeight;

    currentY += direction * speed;

    if (currentY >= maxY || currentY <= 0) {
        direction *= -1;
    }

    target.style.top = currentY + "px";
    target.style.right = "20px";

    animationFrame = requestAnimationFrame(smoothMoveTarget);
};

const updateScore = () => {

    score++;
    scoreDisplay.textContent = score;
    increaseDifficulty();
};


const startTimer = () => {

    timerInterval = setInterval(() => {

        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) endGame();

    }, 1000);
};

const increaseDifficulty = () => {

    if (score % 2 === 0 && speed < 6) {
        speed += 0.5;
    }
};

const startGame = () => {

    if (gameRunning) return;

    gameRunning = true;
    score = 0;
    timeLeft = 30;
    speed = 1.5;
    currentY = 0;
    direction = 1;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    smoothMoveTarget();
    startTimer();
};

const endGame = () => {

    gameRunning = false;
    cancelAnimationFrame(animationFrame);
    clearInterval(timerInterval);

    alert("Game Over! Score: " + score);
};

outer.addEventListener("click", () => {

    if (!gameRunning) return;

    const bullet = document.createElement("div");
    bullet.classList.add("bullet");

    bullet.style.left = "60px";
    bullet.style.top = "185px";

    outer.appendChild(bullet);

    let posX = 60;

    const bulletMove = setInterval(() => {

        posX += 8;
        bullet.style.left = posX + "px";

        const bulletRect = bullet.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        if (
            bulletRect.right > targetRect.left &&
            bulletRect.left < targetRect.right &&
            bulletRect.bottom > targetRect.top &&
            bulletRect.top < targetRect.bottom
        ) {
            updateScore();
            bullet.remove();
            clearInterval(bulletMove);
        }

        if (posX > outer.clientWidth) {
            bullet.remove();
            clearInterval(bulletMove);
        }

    }, 20);
});

startBtn.addEventListener("click", startGame);
