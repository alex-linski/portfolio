// WHAT NEEDS TO BE DONE

// Change the level load function to also take levelRows and levelColumns as parameters as well as something similar for its helper functions. This is to make it more adaptable



var canvas, canvas_context;
var blockWidth;
var blockHeight;

window.onload = function() {

    canvas = document.getElementById('game-canvas');
    canvas_context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    blockWidth = canvas.width/levelColumns;
    blockHeight = canvas.height/levelRows;

    player1 = new playerClass();
    player2 = new playerClass();
    player2.color = 'orange';
    setUpInput();
    loadLevel(levelsList[levelActive]);

    var frames_per_second = 30;
    setInterval(updateAll, 1000/frames_per_second);
}
 

// Update method > Every action that is done 30fps
function updateAll() {
    drawAll();
    player1.movePlayer();
    player2.movePlayer();
}

// ***********************************************************************************
// ***********************************************************************************
// DRAW HELPER FUNCTIONS
// ***********************************************************************************
// ***********************************************************************************


function colorRect(topLeftX,topLeftY,boxWidth,boxHeight,fillColor) {
    canvas_context.fillStyle = fillColor;
    canvas_context.fillRect(topLeftX,topLeftY,boxWidth,boxHeight);
}

function colorCircle(centerX,centerY,radius,fillColor) {
    canvas_context.fillStyle = fillColor;
    canvas_context.beginPath();
    canvas_context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    canvas_context.fill();
}

function colorText(showWords, textX,textY, fillColor, size ) {
    canvas_context.fillStyle = fillColor;
    canvas_context.font = size;
    canvas_context.fillText(showWords, textX,textY);
}


// ***********************************************************************************
// ***********************************************************************************
// DRAWING SECTION > what is being drawn
// ***********************************************************************************
// ***********************************************************************************

function drawAll() {

    colorRect(0,0,canvas.width,canvas.height,'black');
    // Canvas Drawn

    drawLevel();

    player2.drawPlayer();
    player1.drawPlayer();
    // draw player
}

// ***********************************************************************************
// ***********************************************************************************
// PLAYER SECTION
// ***********************************************************************************
// ***********************************************************************************

function playerClass() {
    this.playerSize = 15;
    this.color = 'blue'
    this.angleOfInnerSquare = Math.PI /4;

    // this.startPositionX = 100;
    // this.startPositionY = 25;
    this.playerX;
    this.playerY;
    this.playerPrevX = this.playerX
    this.playerPrevY = this.playerY;

    this.playerLeftMove;
    this.playerRightMove;
    this.playerUpMove;

    this.playerMovingLeft = false;
    this.playerMovingRight = false;
    this.playerJumped = false;

    this.playerAcceleration = 0.25;
    this.playerFriction = 0.15;
    this.playerAccelerationInAir = 0.075;
    this.playerJumpSpeed = 8;
    this.playerMaxSpeed = 5;

    this.playerJumping = false;
    this.playerFalling = true;
    // NEW: Velocity properties for bounce
    this.playerVelocityX = 0;
    this.playerVelocityY = 0;
    this.coefficientOfRestitution = 0.6; // Bounce factor (0.6 = 60% energy retained)

    this.playerDistanceMovedX = 0;

    this.playerWins = 0;

    this.drawPlayer = function()
    {
        colorCircle(this.playerX,this.playerY, this.playerSize, this.color);

        // Draw rotated square in the middle
        var squareSize = 11;
        canvas_context.save();
        canvas_context.translate(this.playerX, this.playerY);
        canvas_context.rotate(this.angleOfInnerSquare); // 45 degrees
        canvas_context.fillStyle = 'white';
        canvas_context.fillRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);
        canvas_context.restore();
    }

    // *******************************************************************************
    // Movement Functions
    // *******************************************************************************

    this.rotatePlayer = function(distanceMoved) {
        if(distanceMoved < 0) 
        {
            this.angleOfInnerSquare += distanceMoved * 0.04;   
        } 
        else if(distanceMoved > 0)
        {
            this.angleOfInnerSquare += distanceMoved * 0.04; 
        }
    }

    this.playerJump = function() {
        this.playerVelocityY = -this.playerJumpSpeed; // Give upward velocity
    }

    this.setUpPlayerInput = function(playerLeftKey,playerRightKey, playerUpKey) 
    {
        this.playerLeftMove = playerLeftKey;
        this.playerRightMove = playerRightKey;
        this.playerUpMove = playerUpKey;
    }

    this.groundPlayerMovement = function() {
        if(this.playerMovingLeft) 
        {
            if(this.playerVelocityX > -this.playerMaxSpeed) {
                this.playerVelocityX -= this.playerAcceleration;
            }
        }
        else if(this.playerMovingRight) 
        {
            if(this.playerVelocityX < this.playerMaxSpeed) {
                this.playerVelocityX += this.playerAcceleration;
            }
        }
        
        this.playerX += this.playerVelocityX;
        this.playerDeceleration();
        
        if(this.playerJumped) 
        {
            this.playerJumping = true;
            this.playerJump();
            this.playerFalling = true;
        }
    }

    this.playerDeceleration = function() {
        if(this.playerVelocityX > 0) {
            this.playerVelocityX -= this.playerFriction;
            if(this.playerVelocityX < 0) {
                this.playerVelocityX = 0;
            } 
        }
        else if(this.playerVelocityX < 0) {
            this.playerVelocityX += this.playerFriction;
            if(this.playerVelocityX > 0) {
                this.playerVelocityX = 0;
            }  
        }
    }

    this.playerMovementWhenFalling = function() {
        if(this.playerMovingLeft) 
        {
            if(this.playerVelocityX > -this.playerMaxSpeed) {
                this.playerVelocityX -= this.playerAccelerationInAir;
            }
        }
        else if(this.playerMovingRight) 
        {
            if(this.playerVelocityX < this.playerMaxSpeed) {
                this.playerVelocityX += this.playerAccelerationInAir;
            }
        }
            
            
        this.playerX += this.playerVelocityX;
    }

    this.movePlayer = function()
    {
        this.playerDistanceMovedX = 0;
        this.playerPrevX = this.playerX;
        this.playerPrevY = this.playerY;

        if(this.playerFalling) {
            gravityActiveOnPlayer(this);
        }

        if(this.playerFalling == false) 
        {
            this.groundPlayerMovement();
        }
        else
        {
            this.playerMovementWhenFalling();
        }

        playerCollisionHandling(this);

        this.playerDistanceMovedX = this.playerX - this.playerPrevX;
        this.rotatePlayer(this.playerDistanceMovedX);

    }
}

// ***********************************************************************************
// ***********************************************************************************
// INPUT SECTION
// ***********************************************************************************
// ***********************************************************************************

const leftMovementKey1 = 37; 
const rightMovementKey1 = 39;
const JumpMovementKey1 = 38;
const leftMovementKey2 = 65; 
const rightMovementKey2 = 68;
const JumpMovementKey2 = 87;  

function setUpInput() {
    document.addEventListener('keydown', keyPressed)
    document.addEventListener('keyup', keyReleased)

    player1.setUpPlayerInput(leftMovementKey1, rightMovementKey1, JumpMovementKey1)
    player2.setUpPlayerInput(leftMovementKey2, rightMovementKey2, JumpMovementKey2)
}

function keyPressed(keyInput) {
    setMovement(player1,keyInput.keyCode,true);
    setMovement(player2,keyInput.keyCode,true)
}

function keyReleased(keyInput) {
    setMovement(player1,keyInput.keyCode,false);
    setMovement(player2,keyInput.keyCode,false);
}

function setMovement(whichPlayer,keyInput, setTo) 
{
    if(keyInput == whichPlayer.playerLeftMove) 
    {
        whichPlayer.playerMovingLeft = setTo;
    }
    if(keyInput == whichPlayer.playerRightMove) 
    {
        whichPlayer.playerMovingRight = setTo;
    }
    if(keyInput == whichPlayer.playerUpMove) 
    {
        whichPlayer.playerJumped = setTo;
    }
}

// ***********************************************************************************
// ***********************************************************************************
// LEVEL SECTION
// ***********************************************************************************
// ***********************************************************************************

const levelRows = 6;
const levelColumns = 8;

// blocks
const levelBackground = 0;
const levelSolid = 1;
const playerStartPos = 2;
const killBlock = 3;
const playerOneScore = 4;
const playerTwoScore = 5;


const playerWon = 4152;

var levelActive = 0;
var playerSpawnPosX;
var playerSpawnPosY;

var levelOne = [0,0,2,1,0,0,0,0,
                0,0,4,1,0,5,0,0,
                0,0,1,0,0,1,0,0,
                0,0,1,0,0,1,0,0,
                0,1,1,1,3,1,1,1,
                1,1,1,1,1,1,1,1,];

var levelTwo = [1,1,0,0,0,0,1,1,
                1,0,1,1,3,1,0,1,
                0,0,0,0,0,0,0,0,
                1,0,0,0,2,0,1,0,
                1,1,1,1,1,1,5,1,
                1,1,1,1,1,1,4,1,];

var levelEndP1Wins = [0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,2,0,0,0,
                      0,0,0,0,1,0,0,0,
                      0,0,0,5,4,0,0,0,];

var levelEndP2Wins = [0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,2,0,0,0,
                      0,0,0,0,1,0,0,0,
                      0,0,0,4,5,0,0,0,];

var levelEndTie = [0,0,0,0,0,0,0,0,
                   0,0,0,0,0,0,0,0,
                   0,0,0,0,0,0,0,0,
                   0,0,0,0,0,0,0,0,
                   0,0,0,0,2,0,0,0,
                   0,0,0,4,5,0,0,0,];

var levelsList = [levelOne, levelTwo];

var currentLevel = [];

function loadLevel(level) 
{
    currentLevel = level.slice();
    for(i = 0; i < currentLevel.length; i++)
    {
        if(currentLevel[i] == playerStartPos) {
            playerSpawnPosX = getXAtLevelIndex(i) + blockWidth/2;
            playerSpawnPosY = getYAtLevelIndex(i) + blockHeight - player1.playerSize;
            player1.playerX = playerSpawnPosX;
            player1.playerY = playerSpawnPosY;
            player2.playerX = playerSpawnPosX;
            player2.playerY = playerSpawnPosY;
            currentLevel[i] = levelBackground;  
        }
    }
    setPlayerStatsToDefault(player1);
    setPlayerStatsToDefault(player2);
}

function setPlayerStatsToDefault(whichPlayer) {
    whichPlayer.angleOfInnerSquare = Math.PI /4;
    whichPlayer.playerMovingLeft = false;
    whichPlayer.playerMovingRight = false;
    whichPlayer.playerJumped = false;
    whichPlayer.playerJumping = false;
    whichPlayer.playerFalling = true;
    whichPlayer.playerVelocityX = 0;
    whichPlayer.playerVelocityY = 0;
    whichPlayer.playerDistanceMovedX = 0;
}

function drawLevel() 
{
    for(var row = 0; row < levelRows; row++) 
    {
        for(var column = 0; column < levelColumns; column++) 
        {
            var blockTypeAtIndex = getBlockTypeAtArrayIndex(row,column);
            var blockColor = getColourToDraw(blockTypeAtIndex);

            colorRect(column*blockWidth,row*blockHeight,blockWidth,blockHeight,blockColor);

            if(blockTypeAtIndex == playerOneScore) 
            {
                colorText(player1.playerWins, (column + 0.25)*blockWidth,(row + 0.8)*blockHeight, 'blue', "75px Arial");
            }
            if(blockTypeAtIndex == playerTwoScore) 
            {
                colorText(player2.playerWins, (column + 0.25)*blockWidth,(row + 0.8)*blockHeight, 'green', "75px Arial");
            }
        }
    }
}

// Level Helpers

function getBlockIndex(row,column) 
{
    return row * levelColumns + column;
}

function getBlockTypeAtArrayIndex(row,column) 
{
    if(row >= 0 && row < levelRows && column >= 0 && column < levelColumns) 
    {
        var blockType = currentLevel[getBlockIndex(row,column)];
        return blockType;
    }
    else 
    {
        return playerWon;
    }

}

function getColourToDraw(blockType) 
{
    switch(blockType) 
    {
        case levelBackground:
            return 'black'; 
        case levelSolid:
            return 'green';
        case playerOneScore:
            return 'grey';
        case playerTwoScore:
            return 'white';
        case killBlock:
            return 'red';
    }
}

function getXAtLevelIndex(levelIndex) {
    return levelIndex % levelColumns * blockWidth;
}


function getYAtLevelIndex(levelIndex) {
    return Math.floor(levelIndex/levelColumns) * blockHeight;
}

// ***********************************************************************************
// ***********************************************************************************
// ***********************************************************************************
// ***********************************************************************************
// COLLISION SECTION
// ***********************************************************************************
// ***********************************************************************************
// ***********************************************************************************
// ***********************************************************************************

function playerCollisionHandling(whichPlayer) 
{
    var prevPlayerRow = Math.floor(whichPlayer.playerPrevY / blockHeight);
    var prevPlayerCol = Math.floor(whichPlayer.playerPrevX / blockWidth);
    var prevPlayerIndex = getBlockIndex(prevPlayerRow,prevPlayerCol);

    // KillBlock
    for(var angle = 0; angle < 2*Math.PI; angle += Math.PI/36) 
    {
        var edgeInfo = getPlayerEdgeBlockInfo(whichPlayer, angle);

        if(edgeInfo.blockType == killBlock) 
        {
            whichPlayer.playerX = playerSpawnPosX;
            whichPlayer.playerY = playerSpawnPosY;
            setPlayerStatsToDefault(whichPlayer);
            checkIfPlayerFalling(whichPlayer);
            return;
        }
    }

    // PlayerWon
    for(var angle = 0; angle < 2*Math.PI; angle += Math.PI/36) 
    {
        var edgeInfo = getPlayerEdgeBlockInfo(whichPlayer, angle);

        if(edgeInfo.blockType == playerWon) 
        {
            whichPlayer.playerWins += 1;
            levelActive += 1
            if(levelActive < levelsList.length) 
            {
                loadLevel(levelsList[levelActive]);
            }
            else 
            {
                player1.playerAcceleration = 0;
                player1.playerUnderGravitySpeed = 0;
                player2.playerAcceleration = 0;
                player2.playerUnderGravitySpeed = 0;

                if(player1.playerWins > player2.playerWins) 
                {
                    loadLevel(levelEndP1Wins);
                    player2.playerX = getXAtLevelIndex(35) + blockWidth/2
                    player2.playerY = getYAtLevelIndex(35) + blockHeight - player1.playerSize;
                }
                else if(player2.playerWins > player1.playerWins) 
                {
                    loadLevel(levelEndP2Wins);
                    player1.playerX = getXAtLevelIndex(35) + blockWidth/2
                    player1.playerY = getYAtLevelIndex(35) + blockHeight - player1.playerSize;
                }
                else 
                {
                    loadLevel(levelEndTie);
                    player1.playerX = getXAtLevelIndex(35) + blockWidth/2
                    player1.playerY = getYAtLevelIndex(35) + blockHeight - player1.playerSize;
                }
            }
            checkIfPlayerFalling(whichPlayer);
            return;
        }
    }

    // SolidBlock
    for(var angle = 0; angle < 2*Math.PI; angle += Math.PI/36) 
    {
        var edgeInfo = getPlayerEdgeBlockInfo(whichPlayer, angle);

        if(isSolidBlock(edgeInfo.blockType)) 
        {
            var playerDirection = returnPlayerDirection(edgeInfo.index, prevPlayerIndex)

            if(playerDirection == "up") 
            {
                whichPlayer.playerY = edgeInfo.row * blockHeight - whichPlayer.playerSize - 0.1;
                
                // BOUNCE LOGIC: Reverse and reduce velocity
                if(whichPlayer.playerVelocityY > 1) { 
                    whichPlayer.playerVelocityY = -whichPlayer.playerVelocityY * whichPlayer.coefficientOfRestitution;
                    whichPlayer.playerFalling = true;
                } else {
                    whichPlayer.playerVelocityY = 0;
                    whichPlayer.playerFalling = false;
                }
            } 
            else if(playerDirection == "left") 
            {
                whichPlayer.playerX = edgeInfo.col * blockWidth - whichPlayer.playerSize - 0.1;

                // BOUNCE LOGIC
                if(whichPlayer.playerVelocityX > 1) { 
                    whichPlayer.playerVelocityX = -whichPlayer.playerVelocityX * whichPlayer.coefficientOfRestitution;
                } else {
                    whichPlayer.playerVelocityX = 0;
                }
            }
            else if(playerDirection == "right") {
                whichPlayer.playerX = (edgeInfo.col + 1) * blockWidth + whichPlayer.playerSize + 0.1;

                if(whichPlayer.playerVelocityX < -1) { 
                    whichPlayer.playerVelocityX = -whichPlayer.playerVelocityX * whichPlayer.coefficientOfRestitution;
                } else {
                    whichPlayer.playerVelocityX = 0;
                }
            } 
            else if(playerDirection == "upDiagLeft" 
                || playerDirection == "upDiagRight") 
            {
                if(playerDirection == "upDiagLeft" && isSolidBlock(currentLevel[edgeInfo.index - 1])) 
                {
                    whichPlayer.playerX = whichPlayer.playerPrevX;
                    whichPlayer.playerY = edgeInfo.row * blockHeight - whichPlayer.playerSize - 0.1;
                    
                    if(whichPlayer.playerVelocityY > 1) {
                        whichPlayer.playerVelocityY = -whichPlayer.playerVelocityY * whichPlayer.coefficientOfRestitution;
                        whichPlayer.playerFalling = true;
                    } else {
                        whichPlayer.playerVelocityY = 0;
                        whichPlayer.playerFalling = false;
                    }
                }
                else if(playerDirection == "upDiagRight" && isSolidBlock(currentLevel[edgeInfo.index + 1])) 
                {
                    whichPlayer.playerX = whichPlayer.playerPrevX;
                    whichPlayer.playerY = edgeInfo.row * blockHeight - whichPlayer.playerSize - 0.1;
                    
                    if(whichPlayer.playerVelocityY > 1) {
                        whichPlayer.playerVelocityY = -whichPlayer.playerVelocityY * whichPlayer.coefficientOfRestitution;
                        whichPlayer.playerFalling = true;
                    } else {
                        whichPlayer.playerVelocityY = 0;
                        whichPlayer.playerFalling = false;
                    }
                }  
                else if(playerDirection == "upDiagLeft") 
                {
                    penetrationLine = getLinearEquation(whichPlayer.playerPrevX,whichPlayer.playerPrevY, whichPlayer.playerX, whichPlayer.playerY);

                    if(penetrationLine.isVertical) {
                        
                    }
                    else
                    {
                        penetration = checkDiaganolPenetration(penetrationLine.slope,penetrationLine.yInt, getXAtLevelIndex(edgeInfo.index),getYAtLevelIndex(edgeInfo.index)
                        )

                        if(penetration == "above") 
                        {
                            whichPlayer.playerY = edgeInfo.row * blockHeight - whichPlayer.playerSize - 0.1;
                        
                            if(whichPlayer.playerVelocityY > 1) {
                                whichPlayer.playerVelocityY = -whichPlayer.playerVelocityY * whichPlayer.coefficientOfRestitution;
                                whichPlayer.playerFalling = true;
                            } else {
                                whichPlayer.playerVelocityY = 0;
                                whichPlayer.playerFalling = false;
                            }
                        } 
                        if(penetration == "below") 
                        {
                            whichPlayer.playerX = edgeInfo.col * blockWidth - whichPlayer.playerSize - 0.1;

                            if(whichPlayer.playerVelocityX > 1) { 
                                whichPlayer.playerVelocityX = -whichPlayer.playerVelocityX * whichPlayer.coefficientOfRestitution;
                            } else {
                                whichPlayer.playerVelocityX = 0;
                            }
                        }
                        if(penetration == "corner") 
                        {
                                whichPlayer.playerX = edgeInfo.col * blockWidth - whichPlayer.playerSize - 0.1;
        
                                if(whichPlayer.playerVelocityX > 1) { 
                                    whichPlayer.playerVelocityX = -whichPlayer.playerVelocityX * whichPlayer.coefficientOfRestitution;
                                } else {
                                    whichPlayer.playerVelocityX = 0;
                                }

                                whichPlayer.playerY = edgeInfo.row * blockHeight - whichPlayer.playerSize - 0.1;
                        
                                if(whichPlayer.playerVelocityY > 1) {
                                    whichPlayer.playerVelocityY = -whichPlayer.playerVelocityY * whichPlayer.coefficientOfRestitution;
                                    whichPlayer.playerFalling = true;
                                } else {
                                    whichPlayer.playerVelocityY = 0;
                                    whichPlayer.playerFalling = false;
                                }
                        }
                    }
                }
                else if(playerDirection == "upDiagRight") 
                {
                    whichPlayer.playerX = (edgeInfo.col + 1) * blockWidth + whichPlayer.playerSize + 0.1;
                }
            }
            else if(playerDirection == "down") 
            {
                whichPlayer.playerY = whichPlayer.playerPrevY;
                whichPlayer.playerJumping = false;

                if(whichPlayer.playerVelocityY < -1) { 
                    whichPlayer.playerVelocityY = -whichPlayer.playerVelocityY * whichPlayer.coefficientOfRestitution;
                    whichPlayer.playerFalling = true;
                } else {
                    whichPlayer.playerVelocityY = 0;
                }
            }
            else if(playerDirection == "downDiagLeft" ||
                    playerDirection == "downDiagRight") 
            {
                if(playerDirection == "downDiagRight" && isSolidBlock(currentLevel[edgeInfo.index + 1])) 
                {
                    whichPlayer.playerY = whichPlayer.playerPrevY;
                    whichPlayer.playerVelocityY = 0;
                    whichPlayer.playerJumping = false;
                }
                else if(playerDirection == "downDiagLeft" && isSolidBlock(currentLevel[edgeInfo.index - 1])) 
                {
                    whichPlayer.playerY = whichPlayer.playerPrevY;
                    whichPlayer.playerVelocityY = 0;
                    whichPlayer.playerJumping = false;
                }
                else if(isSolidBlock(currentLevel[edgeInfo.index + levelColumns])) 
                {
                    whichPlayer.playerX = whichPlayer.playerPrevX;
                }
                else
                {
                    whichPlayer.playerX = whichPlayer.playerPrevX;
                }
            }

            checkIfPlayerFalling(whichPlayer);
            return;
        }
    }
    
    checkIfPlayerFalling(whichPlayer);
}

// **************************************
// COLLISION HELPERS
// **************************************

function isSolidBlock(blockType) {
    return blockType == levelSolid || 
           blockType == playerOneScore || 
           blockType == playerTwoScore;
}

function getPlayerEdgeBlockInfo(whichPlayer, angle) {
    var playerEdgeX = whichPlayer.playerX + Math.cos(angle) * whichPlayer.playerSize;
    var playerEdgeY = whichPlayer.playerY + Math.sin(angle) * whichPlayer.playerSize;
    var playerEdgeCol = Math.floor(playerEdgeX / blockWidth);
    var playerEdgeRow = Math.floor(playerEdgeY / blockHeight);
    var playerEdgeIndex = getBlockIndex(playerEdgeRow, playerEdgeCol);
    var playerEdgeBlockTypeAtIndex = getBlockTypeAtArrayIndex(playerEdgeRow, playerEdgeCol);
    
    return {
        x: playerEdgeX,
        y: playerEdgeY,
        col: playerEdgeCol,
        row: playerEdgeRow,
        index: playerEdgeIndex,
        blockType: playerEdgeBlockTypeAtIndex
    };
}

function checkIfPlayerFalling(whichPlayer) {
    // Check the cell directly below the player's center
    var belowBallRow = Math.floor((whichPlayer.playerY + whichPlayer.playerSize + 0.1) / blockHeight)
    var belowBallCol = Math.floor(whichPlayer.playerX / blockWidth);
    var blockBelow = getBlockTypeAtArrayIndex(belowBallRow, belowBallCol);
    
    if(!isSolidBlock(blockBelow) && blockBelow != playerWon && !whichPlayer.playerJumping) 
    {
        // Nothing below player anymore - start falling
        whichPlayer.playerFalling = true;
    }
}

function returnPlayerDirection(playerIndex, prevPlayerIndex) 
{
    if(playerIndex - levelColumns == prevPlayerIndex) 
    {
        return "up";
    }
    if(playerIndex + levelColumns == prevPlayerIndex) 
    {
        return "down";
    }
    if(playerIndex - 1 == prevPlayerIndex) 
    {
        return "left";
    }
    if(playerIndex + 1 == prevPlayerIndex) 
    {
        return "right";
    }
    if(playerIndex - levelColumns - 1 == prevPlayerIndex)
    {
        return "upDiagLeft";
    }
    if(playerIndex - levelColumns + 1 == prevPlayerIndex)
    {
        return "upDiagRight"; 
    }
    if(playerIndex + levelColumns - 1 == prevPlayerIndex)
    {
        return "downDiagLeft";
    }
    if(playerIndex + levelColumns + 1 == prevPlayerIndex)
    {
        return "downDiagRight"; 
    }
}

function getLinearEquation(x1,y1, x2,y2) 
{
    if(x1 == x2) 
    {
        return {
            isVertical: true,
        }
    }

    m = (y2-y1)/(x2-x1);
    b = y1 - m*x1;
    
    return {
        isVertical: false,
        slope: m,
        yInt: b
    }
}

function getYOfLinFunc(m,b, xValue) 
{
    return m * xValue + b;
}

function checkDiaganolPenetration(m,b, vertexXValue,vertexYValue) 
{
    if(getYOfLinFunc(m,b, vertexXValue) > vertexYValue) 
    {
        return "above";
    }
    else if(getYOfLinFunc(m,b, vertexXValue) < vertexYValue) 
    {
        return "below"
    }
    else 
    {
        return "corner";
    }
}

// ***********************************************************************************
// ***********************************************************************************
// GRAVITY SECTION
// ***********************************************************************************
// ***********************************************************************************

var gravityPower = 0.25;

function gravityActiveOnPlayer(whichPlayer) 
{
    whichPlayer.playerVelocityY += gravityPower;
    whichPlayer.playerY += whichPlayer.playerVelocityY;
}

