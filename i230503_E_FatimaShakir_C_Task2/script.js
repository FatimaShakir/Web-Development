//DOM ELEMENTS
const target = document.getElementById("innerBox");
const outer = document.querySelector(".outer");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

let score = 0;
let timeLeft = 20;
let gameRunning = false;
let moveInterval;
let timerInterval;
let speed = 1000;

const moveTarget = () => {
    const maxX = outer.clientWidth - target.clientWidth;
    const maxY = outer.clientHeight - target.clientHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    target.style.left = randomX + "px";
    target.style.top = randomY + "px";
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
    if (score % 3 === 0 && speed > 200) {
        speed -= 100;
        clearInterval(moveInterval);
        moveInterval = setInterval(moveTarget, speed);
    }
};

const startGame = () => {
    if (gameRunning) return;

    gameRunning = true;
    score = 0;
    timeLeft = 20;
    speed = 800;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    moveInterval = setInterval(moveTarget, speed);
    startTimer();
};

const endGame = () => {
    clearInterval(moveInterval);
    clearInterval(timerInterval);
    gameRunning = false;
    alert("Game Over! Score: " + score);
};

// ===== EVENT LISTENERS =====
startBtn.addEventListener("click", startGame);

target.addEventListener("click", (e) => {
    if (!gameRunning) return;
    e.stopPropagation();
    updateScore();
});
