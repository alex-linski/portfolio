
// Images might load later then the code and canvas so checking if the car is loaded when checking dimensions and other stuff will prevent errors
const groundSpeed_DecayMult = 0.94;
const drive_power = 0.5;
const reverse_power = 0.05;
const turn_rate = 0.06;
const min_speed_to_turn = 0.5
// You want there to be a minimum speed needed to turn because a car normally can't turn while in place

// A class in programming especially OOP defines the common characteristics (data or attributes) and actions (functions or methods) that objects created from it will have. In js there is no specific class code so functions can serve kind of the same role.
// This is a constructer class
// When a function is used as a constructor with the new keyword, *this* refers to the newly created instance of the object.
function carClass() {
    this.x = 75;
    this.y = 75;
    this.ang = 0;
    this.speed = 0;
    this.name = "Untitled Car"

    this.keyHeld_gas = false;
    this.keyHeld_reverse = false;
    this.keyHeld_TurnLeft = false;
    this.keyHeld_TurnRight = false;

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

    this.reset = function(carName) {
        this.name = carName;
        for (let eachRow = 0; eachRow < track_rows; eachRow++) {
            for (let eachCol = 0; eachCol < track_cols; eachCol++) {
    
                var arrayIndex = rowColToArrayIndex(eachCol,eachRow);
    
                if (trackGrid[arrayIndex] == track_playerStart) {
                    trackGrid[arrayIndex] = track_road;
                    // This is to reset the space where the car will be to have the same collision and rendering that a plain 0 tile would have. 
                    this.x = eachCol * track_W + track_W/2;
                    this.y = eachRow * track_H + track_H/2;
                    this.speed = 0;
                    this.ang = -Math.PI /2
                    // Sets starts position
                    return
                }
            }
        }
    }
    
    this.move = function() {
        this.speed *= 0.97
        // This makes the car decrease in speed every frame (so it stops when not holding gas)
        // Car speed will not get to 0 but will decrease so much js doesn't even register its movement
    
        if(this.keyHeld_gas) {
            this.speed += drive_power;
        }
        if(this.keyHeld_reverse) {
            this.speed -= reverse_power;
        }
        if(this.keyHeld_TurnLeft && Math.abs(this.speed) > min_speed_to_turn) {
            this.ang -= turn_rate;
        }
        if(this.keyHeld_TurnRight && Math.abs(this.speed) > min_speed_to_turn) {
            this.ang += turn_rate;
        }
        // You wan't absolute value of carspeed because you can be going both reverse(negative) and forward with the car
    
        this.x += Math.cos(this.ang) * this.speed;
        this.y += Math.sin(this.ang) * this.speed;
        // To make the car go at a constant "speed" no matter the direction you can't just add the same amount of x and y to carX and carY, it has to be variable. for the x value cos gets the accurate amount and for the y value sin is used. sin and cos are multiplied onto the amount of tiles you want the car to move (speed).
        // Think of it as being able to find any point on the edge of a circle because the distance from the center (car starting point) will always be the same
        // When drawing the radius we can make a right triangle. The legs of that triangle are the x and y amounts we want the car to move ot get that diaganol. We use sin and cos knowing the hypotenuse (car speed) already to find those legs.
        // angles are calculated in radians

        carTrackHandling(this);
        // when just using this inside a constructor function it references itself (the instance of the object)
    }
    
    this.draw = function(pic) {
        drawBitMapCenteredWithRotation(pic, this.x,this.y, this.ang);
        // draws car
    }
}