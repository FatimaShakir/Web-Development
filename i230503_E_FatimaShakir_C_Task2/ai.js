// DOM Elements
const gameArea = document.getElementById('gameArea');
const arrow = document.getElementById('arrow');
const target = document.getElementById('target');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const difficultyElement = document.getElementById('difficulty');
const shootBtn = document.getElementById('shootBtn');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Game state variables
let score = 0;
let timeLeft = 60;
let gameActive = true;
let targetSpeed = 2;
let targetDirectionX = 1;
let targetDirectionY = 1;
let gameTimer;
let targetMoveTimer;
let arrowFlyTimer;

// Initialize game
function initGame() {
    // Reset game state
    score = 0;
    timeLeft = 60;
    gameActive = true;
    targetSpeed = 2;
    
    // Reset UI
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    difficultyElement.textContent = "Easy";
    gameOverElement.style.display = "none";
    arrow.style.display = "none";
    
    // Position target randomly
    moveTargetToRandomPosition();
    
    // Start timers
    startTimer();
    startTargetMovement();
    
    // Update difficulty display
    updateDifficulty();
}

// Start the countdown timer
function startTimer() {
    clearInterval(gameTimer);
    
    gameTimer = setInterval(() => {
        if (!gameActive) return;
        
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Start moving the target
function startTargetMovement() {
    clearInterval(targetMoveTimer);
    
    targetMoveTimer = setInterval(() => {
        if (!gameActive) return;
        
        moveTarget();
    }, 16); // Approximately 60fps
}

// Move the target within the game area
function moveTarget() {
    if (!gameActive) return;
    
    const gameRect = gameArea.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    // Calculate new position
    let newX = target.offsetLeft + (targetSpeed * targetDirectionX);
    let newY = target.offsetTop + (targetSpeed * targetDirectionY);
    
    // Check for boundaries and reverse direction if needed
    if (newX <= 0 || newX + targetRect.width >= gameRect.width) {
        targetDirectionX *= -1;
        newX = target.offsetLeft + (targetSpeed * targetDirectionX);
    }
    
    if (newY <= 0 || newY + targetRect.height >= gameRect.height) {
        targetDirectionY *= -1;
        newY = target.offsetTop + (targetSpeed * targetDirectionY);
    }
    
    // Apply new position
    target.style.left = `${newX}px`;
    target.style.top = `${newY}px`;
}

// Move target to a random position
function moveTargetToRandomPosition() {
    const gameRect = gameArea.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    const maxX = gameRect.width - targetRect.width;
    const maxY = gameRect.height - targetRect.height;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}

// Shoot the arrow
function shootArrow() {
    if (!gameActive) return;
    
    // Show arrow
    arrow.style.display = "block";
    
    // Reset arrow position
    arrow.style.left = "100px";
    
    // Get target position
    const targetRect = target.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    
    // Calculate distance to target
    const targetX = targetRect.left - gameRect.left + targetRect.width / 2;
    const targetY = targetRect.top - gameRect.top + targetRect.height / 2;
    
    // Arrow start position
    let arrowX = 100;
    let arrowY = gameRect.height / 2;
    
    // Animate arrow movement
    clearInterval(arrowFlyTimer);
    
    arrowFlyTimer = setInterval(() => {
        // Move arrow
        arrowX += 10;
        arrow.style.left = `${arrowX}px`;
        
        // Check if arrow is out of bounds
        if (arrowX > gameRect.width) {
            clearInterval(arrowFlyTimer);
            arrow.style.display = "none";
            return;
        }
        
        // Check collision with target
        const arrowRect = arrow.getBoundingClientRect();
        const targetRectCurrent = target.getBoundingClientRect();
        
        if (isCollision(arrowRect, targetRectCurrent)) {
            // Hit detected
            clearInterval(arrowFlyTimer);
            arrow.style.display = "none";
            handleHit();
        }
    }, 16); // Approximately 60fps
}

// Check collision between arrow and target
function isCollision(arrowRect, targetRect) {
    return (
        arrowRect.left < targetRect.right &&
        arrowRect.right > targetRect.left &&
        arrowRect.top < targetRect.bottom &&
        arrowRect.bottom > targetRect.top
    );
}

// Handle target hit
function handleHit() {
    if (!gameActive) return;
    
    // Increase score
    score += 10;
    scoreElement.textContent = score;
    
    // Create hit effect
    createHitEffect();
    
    // Move target to new position
    moveTargetToRandomPosition();
    
    // Update difficulty based on score
    updateDifficulty();
}

// Create visual effect when target is hit
function createHitEffect() {
    const targetRect = target.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    
    const hitEffect = document.createElement('div');
    hitEffect.classList.add('hit-effect');
    
    // Position effect at target center
    const effectX = targetRect.left - gameRect.left + targetRect.width / 2;
    const effectY = targetRect.top - gameRect.top + targetRect.height / 2;
    
    hitEffect.style.left = `${effectX - 50}px`;
    hitEffect.style.top = `${effectY - 50}px`;
    
    gameArea.appendChild(hitEffect);
    
    // Remove effect after animation completes
    setTimeout(() => {
        hitEffect.remove();
    }, 600);
}

// Update difficulty based on score
function updateDifficulty() {
    let difficultyLevel;
    
    if (score < 30) {
        difficultyLevel = "Easy";
        targetSpeed = 2;
    } else if (score < 70) {
        difficultyLevel = "Medium";
        targetSpeed = 3;
    } else if (score < 120) {
        difficultyLevel = "Hard";
        targetSpeed = 4;
    } else {
        difficultyLevel = "Expert";
        targetSpeed = 5;
    }
    
    // Update target size based on difficulty (smaller target = harder)
    const targetSize = 80 - (targetSpeed - 2) * 10;
    target.style.width = `${targetSize}px`;
    target.style.height = `${targetSize}px`;
    
    // Update difficulty display
    difficultyElement.textContent = difficultyLevel;
}

// End the game
function endGame() {
    gameActive = false;
    
    // Clear timers
    clearInterval(gameTimer);
    clearInterval(targetMoveTimer);
    clearInterval(arrowFlyTimer);
    
    // Show game over screen
    finalScoreElement.textContent = score;
    gameOverElement.style.display = "flex";
}

// Event Listeners
shootBtn.addEventListener('click', shootArrow);

restartBtn.addEventListener('click', () => {
    initGame();
});

playAgainBtn.addEventListener('click', () => {
    initGame();
});

// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (!gameActive) return;
    
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent space from scrolling page
        shootArrow();
    }
});

// Prevent right-click context menu on game area
gameArea.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Initialize game on page load
window.addEventListener('DOMContentLoaded', initGame);