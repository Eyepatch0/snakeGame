const eatSound = new Audio('../Audio/eat.mp3');
const deathSound = new Audio('../Audio/die.mp3');
const moveSound = new Audio('../Audio/move.mp3');
const musicSound = new Audio('../Audio/music.mp3');

// ------------------- Game Variables -------------------
let board = document.querySelector('.board'); // board is the div where the snake will be displayed
let scoreDisplay = document.querySelector('.userScoreNow'); // score is the div where the score will be displayed
let direction = { x: 0, y: 0 }; // direction of the snake movement
let lastRenderTime = 0;
let snakeSpeed = 5;
let snakeArray = [{ x: 11, y: 11 }]; // array of the snake's body parts
let food = { x: 2, y: 2 }; // food is an object with x and y properties
let score = 0;

// ------------------- Game Functions -------------------
function main(currentTime) { // main game loop
    window.requestAnimationFrame(main); // requestAnimationFrame is a function that calls the main function again and again
    if ((currentTime - lastRenderTime) / 1000 < 1 / snakeSpeed) return;
    lastRenderTime = currentTime; // lastRenderTime is the time when the last frame was rendered
    // console.log(currentTime);
    gameEngine(); // gameEngine is the function that updates the game
};

function collisionCheck(snek) { // collisionCheck checks if the snake collides with the wall or itself
    // collision with the body
    for (let i = 1; i < snek.length; i++) {
        if (snek[i].x == snek[0].x && snek[i].y == snek[0].y) {
            return true;
        }
    }
    //collision with the wall
    if (snek[0].x < 0 || snek[0].x > 20 || snek[0].y < 0 || snek[0].y > 20) {
        return true;
    }
    return false;
}

function gameEngine() {
    if (collisionCheck(snakeArray)) { // if the snake collides with the wall or itself, the game ends
        deathSound.play();
        musicSound.pause();
        musicSound.currentTime = 0;
        direction = { x: 0, y: 0 };
        alert('Game Over! Press any key to play again');
        snakeArray = [{ x: 11, y: 11 }];
        musicSound.play();
        score = 0;
        scoreDisplay.innerHTML = score;
    }
    //Updating snake if it eats food
    if (snakeArray[0].x === food.x && snakeArray[0].y === food.y) { // if the snake eats food, the snake grows and the score increases
        score += 1;
        if(score>highScore){
            highScore = score;
            localStorage.setItem('highScore', JSON.stringify(highScore));
            highScoreDisplay.innerHTML = highScore;
        }
        eatSound.play();
        snakeArray.unshift({ x: snakeArray[0].x + direction.x, y: snakeArray[0].y + direction.y }); // unshift adds an element to the beginning of the array
        food = { x: Math.round(1 + (19 * Math.random())), y: Math.round(1 + (19 * Math.random())) }; // food is generated at a random position
        scoreDisplay.innerHTML = score;
    }
    //snake movement
    for (let i = snakeArray.length - 2; i >= 0; i--) { // for loop that moves the snake's body parts , it doesn't move the head of the snake
        snakeArray[i + 1] = { ...snakeArray[i] }; // to change the position of the snake, we copy the previous position of the snake and to avoid reference problems, we use the spread operator
    }
    snakeArray[0].x += direction.x; // the head of the snake moves in the direction of the movement
    snakeArray[0].y += direction.y; // the head of the snake moves in the direction of the movement
    //rendering the snake
    board.innerHTML = ""; // clears the board

    snakeArray.forEach((e, index) => { // for each element in the snakeArray, create a div and add it to the board
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index == 0) {
            snakeElement.classList.add('snakeHead');
        }
        else {
            snakeElement.classList.add('snakeBody');
        }
        board.appendChild(snakeElement);
    });

    // display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}
// ------------------- Main Logic -------------------
let highScoreDisplay = document.querySelector('#highScoreValue'); // highScoreDisplay is the div where the high score will be displayed
let highScore = localStorage.getItem('highScore'); // highScore is the highest score that the user has achieved
if (highScore == null) { // if the user has not yet achieved a high score, the high score is set to 0
    localStorage.setItem('highScore', JSON.stringify(0));
}
else {
    highScore = JSON.parse(localStorage.getItem('highScore'));
    highScoreDisplay.innerHTML = highScore;
}
highScoreDisplay.innerHTML = highScore;
window.requestAnimationFrame(main); //calling game loop
window.addEventListener('keydown', e => { // event listener for keydown
    direction = { x: 0, y: 1 }; // start the game
    moveSound.play();
    musicSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp"); // if the user presses the up arrow, the snake moves up
            direction.x = 0;
            direction.y = -1;
            break;
        case "ArrowDown":
            console.log("ArrowDown"); // if the user presses the down arrow, the snake moves down
            direction.x = 0;
            direction.y = 1;
            break;
        case "ArrowLeft":
            console.log("ArrowLeft"); // if the user presses the left arrow, the snake moves left
            direction.x = -1;
            direction.y = 0;
            break;
        case "ArrowRight":
            console.log("ArrowRight"); // if the user presses the right arrow, the snake moves right
            direction.x = 1;
            direction.y = 0;
            break;
        default:
            break;
    }
});