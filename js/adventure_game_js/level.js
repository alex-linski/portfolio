
var wallPic = document.createElement("img");;
var roadPic = document.createElement("img");; 

// In the video he made const variables all uppercase (good idea) -> I didn't :(
const track_W = 50;
const track_H = 50;
const track_cols = 16;
const track_rows = 12;
const track_gap = 2;
// This grid sucks to change with this font and color
var levelOne = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 1, 1, 1, 1,
                1, 0, 4, 0, 4, 0, 1, 0, 2, 0, 1, 0, 1, 4, 4, 1,
                1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 5, 1, 5, 1, 1,
                1, 1, 1, 5, 1, 1, 1, 0, 4, 0, 1, 0, 0, 0, 1, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1,
                1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 0, 1, 1,
                1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1,
                1, 0, 5, 0, 5, 0, 5, 0, 3, 0, 1, 1, 1, 1, 1, 1,
                1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
// Making a track layout with 1's and 0's is better then representing space with trues and falses as there is less code. Also it doesn't limit blocks to being just there or not there -> new numbers could represent special blocks like powerups, killzones, etc... Showing the array in vs code as it would be on the canvas with rows and columns makes it easier to change things yourself.

var trackGrid =[];


const world_road = 0;
const world_wall = 1;
const track_playerStart = 2;
const world_trophy = 3;
const world_key = 4;
const world_door = 5;

function rowColToArrayIndex(col,row) {
    return track_cols * row + col;
}

function returnTileTypeAtColRow(col,row) {
    if (col >= 0 && col < track_cols && row >= 0 && row < track_rows) {
        var trackIndexUnderCoord = rowColToArrayIndex(col,row);
        return trackGrid[trackIndexUnderCoord];
    } else {
        return world_wall;
    }
}

function treatAsWall(whichWarrior) {
    whichWarrior.x = whichWarrior.prev_x;
    whichWarrior.y = whichWarrior.prev_y;
}

function warriorTrackHandling(whichWarrior) {
    var warriorTrackCol = Math.floor(whichWarrior.x / track_W);
    var warriorTrackRow = Math.floor(whichWarrior.y / track_H);
    var trackIndexUnderWarrior = rowColToArrayIndex(warriorTrackCol,warriorTrackRow);

    if (warriorTrackCol >= 0 && warriorTrackCol < track_cols && warriorTrackRow >= 0 && warriorTrackRow < track_rows) {
        var tileHere = returnTileTypeAtColRow(warriorTrackCol,warriorTrackRow);

        switch(tileHere) {
            case world_key:
                whichWarrior.keys_held++;
                trackGrid[trackIndexUnderWarrior] = world_road;
                break;
            case world_door:
                if(whichWarrior.keys_held > 0) {
                    whichWarrior.keys_held--;
                    trackGrid[trackIndexUnderWarrior] = world_road;
                } else {
                    treatAsWall(whichWarrior);
                }
                break;
            case world_trophy:
                console.log(whichWarrior.name + ' wins!')
                loadLevel(levelOne);
                break;
            case world_wall:
                treatAsWall(whichWarrior);
                break;   
        }  
    } 
}


function tileTypeTransparency(checkTileType) {
    return (checkTileType == world_trophy ||
            checkTileType == world_key ||
            checkTileType == world_door
    );
}
// You can use brackets to use AND or OR statements even outside of if/else statements

function drawTracks() {
    var arrayIndex = 0
    var drawTileX = 0;
    var drawTileY = 0;
    for (let eachRow = 0; eachRow < track_rows; eachRow++) {
        for (let eachCol = 0; eachCol < track_cols; eachCol++) {
            var tileKindHere = trackGrid[arrayIndex];
            // If you are calculating the same thing multiple times make a variable for it
            if(tileTypeTransparency(tileKindHere)) {
                canvas_context.drawImage(trackpics[world_road], drawTileX, drawTileY);
            }
            
            var useImg = trackpics[tileKindHere];
            // something is used many times -> make variable -> e.g an image was always being registered to be drawn -> instead of writing the different image variable each time in a different draw call make and image variable and put in that call

            canvas_context.drawImage(useImg, drawTileX, drawTileY);
            // .drawImage takes parameters image(needs src) and x & y coordinates

            arrayIndex++;
            drawTileX += track_W;
            // You don't need to calculate what the arrayindex would be because you know it will climb by one through this loop
        }
        drawTileX = 0;
        drawTileY += track_H;
    }

    // make variables descriptive (even for loop variables)
}