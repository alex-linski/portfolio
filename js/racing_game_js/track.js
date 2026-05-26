
var wallPic = document.createElement("img");;
var roadPic = document.createElement("img");; 

// In the video he made const variables all uppercase (good idea) -> I didn't :(
const track_W = 40;
const track_H = 40;
const track_cols = 20;
const track_rows = 15;
const track_gap = 2;
// This grid sucks to change with this font and color
var levelOne = [4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
                4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
                4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
                1, 0, 0, 0, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 1,
                1, 0, 0, 1, 1, 0, 0, 1, 4, 4, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 5, 0, 0, 1, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 5, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                1, 2, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 1,
                1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                0, 3, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
                0, 3, 0, 0, 0, 0, 1, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 4];
// Making a track layout with 1's and 0's is better then representing space with trues and falses as there is less code. Also it doesn't limit blocks to being just there or not there -> new numbers could represent special blocks like powerups, killzones, etc... Showing the array in vs code as it would be on the canvas with rows and columns makes it easier to change things yourself.

var trackGrid =[];


const track_road = 0;
const track_wall = 1;
const track_playerStart = 2;
const track_goal = 3;
const track_tree = 4;
const track_flag = 5;

function rowColToArrayIndex(col,row) {
    return track_cols * row + col;
}

function returnTileTypeAtColRow(col,row) {
    if (col >= 0 && col < track_cols && row >= 0 && row < track_rows) {
        var trackIndexUnderCoord = rowColToArrayIndex(col,row);
        return trackGrid[trackIndexUnderCoord];
    } else {
        return track_wall;
    }
}

function carTrackHandling(whichCar) {
    var carTrackCol = Math.floor(whichCar.x / track_W);
    var carTrackRow = Math.floor(whichCar.y / track_H);
    var trackIndexUnderCar = rowColToArrayIndex(carTrackCol,carTrackRow);

    if (carTrackCol >= 0 && carTrackCol < track_cols && carTrackRow >= 0 && carTrackRow < track_rows) {
        var tileHere = returnTileTypeAtColRow(carTrackCol,carTrackRow);

        if(tileHere == track_goal) {
            console.log(whichCar.name + ' wins!')
            loadLevel(levelOne);
        } else if(tileHere != track_road) {
            whichCar.x -= Math.cos(whichCar.ang) * whichCar.speed;
            whichCar.y -= Math.sin(whichCar.ang) * whichCar.speed;
            // so that car doesn't burrow into wall
    
            whichCar.speed *= -0.5;
            // car rebounds against wall
        }
    }
}

function drawTracks() {
    var arrayIndex = 0
    var drawTileX = 0;
    var drawTileY = 0;
    for (let eachRow = 0; eachRow < track_rows; eachRow++) {
        for (let eachCol = 0; eachCol < track_cols; eachCol++) {
            var tileKindHere = trackGrid[arrayIndex];
            // If you are calculating the same thing multiple times make a variable for it
            
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
// Look to optimize code in obvious places. e.g drawTracks drawing 300times per frame

// Old phased out code

// switch(tileKindHere) {
//     case track_road:
//         useImg = roadPic;
//         break;
//     case track_wall:
//         useImg = wallPic;
//         break;
//     case track_tree:
//         useImg = treePic;
//         break;
//     case track_flag:
//         useImg = flagPic;
//         break;
//     case track_goal:
//         useImg = goalPic;
//         break;
// }
// // The switch case method uses switch to set a value -> if that value is equal to the case values that case occurs.
// // break; ends a iteration of a loop.