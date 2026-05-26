
var canvas, canvas_context;

var warrior = new warriorClass();

window.onload = function() {
    canvas = document.getElementById('game-canvas');
    canvas.width = 800;
    canvas.height = 600;
    canvas_context = canvas.getContext('2d');

    colorRect(0,0,canvas.width,canvas.height, 'black');
    colorText("LOADING IMAGES", canvas.width/2,canvas.height/2, "white")
    // This is basically a loading screen for before images are loaded. Images might not load immediatley with poor connection and user would see nothing

    loadImages();
}

function imagesLoadedSoGameStart() {
    var frames_per_second = 30;
    setInterval(updateAll, 1000/frames_per_second);

    setUpInput();
    
    loadLevel(levelOne);
}

function loadLevel(whichLevel) {
    trackGrid = whichLevel.slice();
    // When making a copy of an array you have to use the slice method. The slice method can create a shallow copy of the whole array or select specific members to include in the copy. You have to do this because when you do copyOfArray = originalArray; it doesn't actually create a copy but just points to the original array.
    warrior.reset("John Warrior");
}
// By loading in levels we can support multiple levels maybe even switching maps every win or something like that

function updateAll() {
    drawAll();
    moveAll();
    // organize your code into functions to be more organized
}    

function moveAll() {
    warrior.move();
    // Group your code into FUNCTIONS
}

function clearScreen() {
    colorRect(0,0,canvas.width,canvas.height,'black')
    // Resets screen
}

function drawAll() {
    clearScreen();
    drawTracks();
    warrior.draw(warriorPic);
    // Whichever draw function is put after the other ones will have a higher "z-index" you could say then the other ones
}
