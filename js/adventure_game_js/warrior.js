
// Images might load later then the code and canvas so checking if the warrior is loaded when checking dimensions and other stuff will prevent errors
const walk_speed = 10;

// A class in programming especially OOP defines the common characteristics (data or attributes) and actions (functions or methods) that objects created from it will have. In js there is no specific class code so functions can serve kind of the same role.
// This is a constructer class
// When a function is used as a constructor with the new keyword, *this* refers to the newly created instance of the object.
function warriorClass() {
    this.x = 75;
    this.y = 75;
    this.prev_x = this.x;
    this.prev_y = this.y; 
    this.ang = -Math.PI /2;
    this.name = "Untitled warrior";
    this.keys_held = 0;

    this.keyHeld_forward = false;
    this.keyHeld_backward = false;
    this.keyHeld_left = false;
    this.keyHeld_right = false;

    this.controlKeyUp;
    this.controlKeyDown;
    this.controlKeyRight;
    this.controlKeyLeft;

    this.setupInput = function(upKey,downKey,leftKey,rightKey) {
        this.controlKeyUp = upKey;
        this.controlKeyDown = downKey;
        this.controlKeyLeft = leftKey;
        this.controlKeyRight = rightKey;
    }

    this.reset = function(warriorName) {
        this.name = warriorName;
        for (let eachRow = 0; eachRow < track_rows; eachRow++) {
            for (let eachCol = 0; eachCol < track_cols; eachCol++) {
    
                var arrayIndex = rowColToArrayIndex(eachCol,eachRow);
    
                if (trackGrid[arrayIndex] == track_playerStart) {
                    trackGrid[arrayIndex] = world_road;
                    // This is to reset the space where the warriror will be to have the same collision and rendering that a plain 0 tile would have. 
                    this.x = eachCol * track_W + track_W/2;
                    this.y = eachRow * track_H + track_H/2;
                    // Sets starts position
                    return
                }
            }
        }
    }
    
    this.move = function() {
    
        if(this.keyHeld_forward) {
            this.y -= walk_speed;
        }
        if(this.keyHeld_backward) {
            this.y += walk_speed
        }
        if(this.keyHeld_left) {
            this.x -= walk_speed;
        }
        if(this.keyHeld_right) {
            this.x += walk_speed
        }

        warriorTrackHandling(this);
        // when just using this inside a constructor function it references itself (the instance of the object)
        this.prev_x = this.x;
        this.prev_y = this.y;
    }
    
    this.draw = function(pic) {
        drawBitMapCenteredWithRotation(pic, this.x,this.y, this.ang);
    }
}