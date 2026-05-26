
var canvas, canvas_context;
// declares variables before they are used (not necessary for js but is for other languages, therefore good habit)

var ballX = 75;
var ballY = 75;
var ball_speedX = 5;
var ball_speedY = 7;
var ballSize = 10;


// In the video he made const variables all uppercase (good idea) -> I didn't :(

const brick_W = 80;
const brick_H = 20;
const brick_cols = 10;
const brick_gap = 2;
const brick_rows = 14;
var brickGrid = [];
// Create empty list to be filled
// var brickGrid = new Array(brick_count); (video method -> not necessary?)
var bricksLeft = 0;

// var brick3 = true;
// true or false to check for existence > true = exists, false = does not exist
// Use an array to be more efficient

const paddle_width = 100;
const paddle_thickness = 10;
const paddle_dist_from_edge = 60;
// const is for variables that don't change
var paddleX = 400;
var paddleY;

var mouseX;
var mouseY;

function brickReset() {
    bricksLeft = 0;
    var i;
    // by initializing this variable at the top we can save the increases in i that occur in the first loop and resume making brick tiles in the second loop without redeclaring the initial size of i

    for(i=0;i < 3*brick_cols;i++) {
        brickGrid[i] = false;
    }
    // Makes Gutter

    for(i;i < brick_cols * brick_rows;i++) {
        brickGrid[i] = true;
        bricksLeft++;
    }

    // var removedBricks = [3,8,24];

    // for (let brick of removedBricks) {
    //     console.log(brick);
    //     brickGrid[brick] = false;
    // }
}
// Fills out the brickGrid

window.onload = function() {
    canvas = document.getElementById('game-canvas');
    canvas_context = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;
    // Claude says this makes it more consistent?

    // the getContext('2d') method returns an object with tools (methods) for drawing.
    paddleY = canvas.height - paddle_dist_from_edge; 

    var frames_per_second = 30;
    setInterval(updateAll, 1000/frames_per_second);
    // The setInterval() method calls a function at specified intervals (in milliseconds) parameters > (function called, interval it is called at (in milliseconds)). Here the interval is 1 second (1000 milliseconds) being divided by 30 so updateAll is being executed 30 times per second (movement at 30fps)

    canvas.addEventListener('mousemove', updateMousePos);
    // the .addEventListener has 2 parameters? (event that happens, what happens because of that event). ????

    brickReset();
    ballReset();
}

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    // The getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
    // The documentElement property returns a document's element (as an Element object) in this case the <html> element.

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
    // the .clientX property returns the horizontal coordinates of the mouse. clientY for vertical coordiantes
    // the .left, .right, .top, and .bottom properties return or set the elements respective coordinates (left edge, top edge, etc...)
    // The .scrollLeft() property sets or returns the number of pixels an element's content is scrolled horizontally.

    paddleX = mouseX - paddle_width/2;

    // if (paddleX < 0) {
    //     paddleX = 0;
    // }

    // if (paddleX > canvas.width - paddle_width) {
    //     paddleX = canvas.width - paddle_width;
    // }
    // Keeps paddle within canvs width (chose to not use because makes game more limited)

    // Cheat / hack to test ball in any position
    // Adding a way to manipulate your chosen test dummy into any position or any action is a a good way to test your games
    // ballX = mouseX;
    // ballY = mouseY;
    // ball_speedX = 3;
    // ball_speedY = -4;
}

function updateAll() {
    moveAll();
    drawAll();
    // organize your code into functions to be more organized
}    

function ballReset () {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ball_speedX = 0;
    // Reset to going straight down to make resets consistent and make the the start of the game simple
}

function ballMove() {
    ballX+= ball_speedX;
    ballY+= ball_speedY;

    if (ballX < ballSize) {
        ball_speedX *= -1;
        ballX = ballSize;
        // This prevents the ball from getting stuck inside the wall which can happen because the ball goes past the wall (moves spaces of 5 or 7 every frame) then gets reversed then touches the wall again then gets reveresed outside again and repeat
    }

    if (ballX > canvas.width-ballSize) {
        ball_speedX *= -1;
        ballX = canvas.width - ballSize;
    }

    if (ballY < ballSize) {
        ball_speedY *= -1;
          ballY = ballSize;
    }

    if (ballY > canvas.height) {
        ballReset();
        brickReset();
    }
    // This code accounts for the ball going out of bounds of the canvas by reversing the direction (have to account for the center of the circle when doing this)
}

function ballPaddleHandling() {
    var paddle_left_edgeX = paddleX;
    var paddle_right_edgeX = paddleX + paddle_width;
    var paddle_top_edgeY = paddleY;
    var paddle_bottom_edgeY = paddleY + paddle_thickness;
    // variables wherever possible good.

    if (ballX >= paddle_left_edgeX
        && ballX <= paddle_right_edgeX
        && ballY >= paddle_top_edgeY
        && ballY <= paddle_bottom_edgeY
        && ball_speedY > 0) { 
        ball_speedY *= -1;

        var paddle_centerX = paddleX + paddle_width/2;
        var ball_dist_from_paddle_centerX = ballX - paddle_centerX
        ball_speedX = ball_dist_from_paddle_centerX * 0.3;
        // Changing speed based on where the ball lands on the paddle encourages skill expression

        // Checks for game win
        if(bricksLeft == 0) {
            brickReset();
            // You only need to reset the brick list and not the draw function as the draw function is constantly checking the brick list
        }
    }
    // When making collision don't do exact values but instead areas
}

function isBrickAtColRow(col,row) {
    if (col >= 0 && col < brick_cols && row >= 0 && row < brick_rows) {
        var brickIndexUnderCoord = rowColToArrayIndex(col,row);
        return brickGrid[brickIndexUnderCoord];
    } else {
        return false
    }
}
// This function is to check if there is a brick at the inputted tile but most importantly it accounts for being outside of the brickgrid
// Just rewatch the videos -> so complicated

function ballBrickHandling() {
    var ballBrickCol = Math.floor(ballX / brick_W);
    var ballBrickRow = Math.floor(ballY / brick_H);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol,ballBrickRow);

    if (ballBrickCol >= 0 && ballBrickCol < brick_cols && ballBrickRow >= 0 && ballBrickRow < brick_rows && brickGrid[brickIndexUnderBall]) {
        brickGrid[brickIndexUnderBall] = false;
        bricksLeft--;
        
        var prevBallX = ballX - ball_speedX;
        var prevBallY = ballY - ball_speedY;
        var prevBrickCol = Math.floor(prevBallX / brick_W);
        var prevBrickRow = Math.floor(prevBallY / brick_H);
        // When I did this myself I kept track of the previous brickCol and brickRow each frame, but since we know the speed of the ball we can manually figure out where it was before


        // look at the video and his charts for this code (very complicated collision detection)
        var bothTestsFailed = true;

        if(ballBrickCol != prevBrickCol) {
            if(isBrickAtColRow(prevBrickCol,ballBrickRow) == false) {
                ball_speedX *= -1;
                bothTestsFailed = false;
            }
        }
        if(ballBrickRow != prevBrickRow) {
            if(isBrickAtColRow(ballBrickCol,prevBrickRow) == false) {
                ball_speedY *=-1;
                bothTestsFailed = false;
            }
        }  

        if(bothTestsFailed) {
            ball_speedX *= -1;
            ball_speedY *= -1
        }
        // When looking to do something when something happens in a game you want to look at what happens before that something happens and figure out how to write code that can tell when that thing that hapenns right before occurs. For example you can figure out that when the ball touches the side of a brick in this scenario it only changes columns, when it touches the top or bottom only the row changes, and when it touches the corner both the row and column changes. Use those unique signifiers to write the different scenarios
        // You don't need to individually check for the corner case as the side and top/bottom cases do it for you in conjunction
    }
    // This checks to see if the ball touches the bricks
    // in this we check if a brick actually EXISTS on the brick coordinate before executing
}

function moveAll() {
    ballMove();
    ballPaddleHandling();
    ballBrickHandling();
    // Group your code into FUNCTIONS
}

function rowColToArrayIndex(col,row) {
    return brick_cols * row + col;
    // This finds the array index of the tile
}
// Make functions for code that is repeated or long? 

function drawBricks() {
    for (let eachRow = 0; eachRow < brick_rows; eachRow++) {
        for (let eachCol = 0; eachCol < brick_cols; eachCol++) {

            var arrayIndex = rowColToArrayIndex(eachCol,eachRow);
            // This variable matches the index of the tile that is being checked

            if (brickGrid[arrayIndex]) {
                colorRect(brick_W*eachCol,brick_H*eachRow, 
                    brick_W-brick_gap,brick_H-brick_gap, 'blue')
            }
        }
    }

    // make variables descriptive (even for loop variables)

    // Video method 

    // brickGrid.forEach((brick,i) => {
    //     if (brick) {
    //         colorRect(brick_W*i,0, brick_W-2,brick_H, 'blue')
    //     }
    // });
    // The .forEach(array element, array index) essentially acts as a function and a loop defining the array element and its corresponding index number as two variables from start to finish of the array. and using them each iteration in a loop 

    // Make the actual brick width a bit smaller to make the code more simple

    // the drawAll function which uses the drawBricks function is constantly redrawing what you see on the canvas to give the illusion that they are constantly there, so by checking if the brick is true or false to see if they should be redrawn you can control their existence
    // if a variable is either true or false if statements don't need a comparism statement, they simply check the variable itself
}

function drawAll() {
    colorRect(0,0,canvas.width,canvas.height,'black')
    // draws canvas
    colorCircle(ballX,ballY,ballSize,'white')
    // draws ball
    colorRect(paddleX, paddleY, paddle_width, paddle_thickness,'white')
    // draws paddle
    drawBricks();
    // Draws bricks

    var mouseBrickCol = Math.floor(mouseX / brick_W);
    var mouseBrickRow = Math.floor(mouseY / brick_H);
    // This makes it so that we see what brick "tile" the mouse is in
    // Math.floor() rounds down to the nearest integer

    if(bricksLeft == 0) {
        colorText('YOU WIN!', 175,300, 'white', '100px Arial')
    }

    var brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol,mouseBrickRow);

    colorText(mouseBrickCol+','+mouseBrickRow+':'+brickIndexUnderMouse, mouseX,mouseY, 'red', '10px Arial')
    // shows mouse coordinattes; good for debugging
    // Whichever draw function is put after the other ones will have a higher "z-index" you could say then the other ones
}

function colorRect(topLeftX,topLeftY,boxWidth,boxHeight,fillColor) {
    canvas_context.fillStyle = fillColor;
    canvas_context.fillRect(topLeftX,topLeftY,boxWidth,boxHeight);
    // .fillStyle styles the background of the element (doesn't work without .fill(rect) or some other space defining method)
    // the .fillRect(x,y,width,height) takes 4 arguments and defines a rectangle
    // This method is included in the updateAll funtion because it basically clears the canvas every update (erases the stamps left by the circle previousley)
}

function colorCircle(centerX,centerY,radius,fillColor) {
    canvas_context.fillStyle = fillColor;
    canvas_context.beginPath();
    canvas_context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    canvas_context.fill();
    // The beginPath() method begins a path. basically initiates a moving/drawing sequence?
    // the .arc() method creates an arc(curve). parameters > (x , y (center), radius, start angle, end angle, true for counter-clockwise and false for clockwise (default)) 
    // the .fill() method fills the path you have created
}

function colorText(showWords, textX,textY, fillColor, size ) {
    canvas_context.fillStyle = fillColor;
    canvas_context.font = size
    canvas_context.fillText(showWords, textX,textY);

    // .fillText draws filled text on a canvas. 4 parameters > (text, x,y, max-width (px))
    // .font sets the font and px size to be used
}
