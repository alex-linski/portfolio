

// The key codes for the arrow buttons
// Establishing them as constants makes the code easier to read when you check for the key code values (not just checking 40 but checking if key_down_arrwow)
const key_left_arrow = 37;
const key_right_arrow = 39;
const key_up_arrow = 38;
const key_down_arrow = 40;

const key_w = 87;
const key_a = 65;
const key_s = 83;
const key_d = 68;

var mouseX;
var mouseY;

function setUpInput() {
    canvas.addEventListener('mousemove', updateMousePos);

    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);
    // We access the document for .addEventListener when we use keys because when we press a key it happens on the whole document not just the canvas(bad explanation?)

    warrior.setupInput(key_up_arrow, key_down_arrow, key_left_arrow, key_right_arrow);
}

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    // Cheat / hack to test warrior in any position
    // Adding a way to manipulate your chosen test dummy into any position or any action is a a good way to test your games
    // warriorX = mouseX;
    // warriorY = mouseY;
}

function keySet(keyEvent,whichWarrior,setTo) {
      // The evt that is being passed to the function is the key press
    // evt.keyCode checks the keycode of the event (each key has a specific code)
    if(keyEvent.keyCode == whichWarrior.controlKeyUp) {
        whichWarrior.keyHeld_forward  = setTo;
    }
    if(keyEvent.keyCode == whichWarrior.controlKeyRight) {
        whichWarrior.keyHeld_right = setTo;
    }
    if(keyEvent.keyCode == whichWarrior.controlKeyLeft) {
        whichWarrior.keyHeld_left = setTo;
    }
    if(keyEvent.keyCode == whichWarrior.controlKeyDown) {
        whichWarrior.keyHeld_backward = setTo;
    }
    // Indtead of setting the movement to happen when it is registered that the key is clicked you can register for the movement to be true (eeeh explanation). When you're holding down the arrow keys since they are built for typing it doesn't register that you're holding it down but you're "constantly clicking it" Rather tracking when you started pressing and when you release it allow the logic to be constant (more smooth and makes it feel like you're holding a gas pedal). Also this allows you to move the checks and movement to the moveAll(); code so that is can match the 30fps

}

function keyPressed(keyEvent) {
    keySet(keyEvent,warrior,true);
    keyEvent.preventDefault();
    // Prevents pressing arrow keys from scrolling page?
}

function keyReleased(keyEvent) {
    keySet(keyEvent,warrior,false);
}