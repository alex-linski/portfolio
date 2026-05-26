
var trackpics = [];
var warriorPic = document.createElement("img");

// var wallPic = document.createElement("img");
// var roadPic = document.createElement("img"); 
// var treePic = document.createElement("img");
// var flagPic = document.createElement("img");
// var goalPic = document.createElement("img");
// .createElement creates a specified element
// Images might load later then the code and canvas so checking if images are loaded before executing code that uses them is necessary to prevent errors
// Different computer setups have different loading speeds which can glitch the the image loading process *important to consider*
// BAD art does not mean a bad game don't worry about it too much

var picsToLoad = 0;
// set automatically later in loadImages

function countLoadedImagesAndLaunchIfReady() {
    picsToLoad--;
    console.log("Images remaining:", picsToLoad);
    if(picsToLoad == 0) {
        imagesLoadedSoGameStart();
    };
    // .onload can trigger something when something has loaded
}

function beginLoadingImage(imgVar, fileName) {
    imgVar.onload = countLoadedImagesAndLaunchIfReady;
    imgVar.src = "img/" +fileName;
    // You set the onload function before the .src so that there is no chance of the image loads before the onload function is ready
    // .src sets the src for a created image (linking the src also causes the img to load?)
}
// This is a helper function -> any function that just aids in shortening code

function loadImageForTrackCode(trackCode, fileName) {
    trackpics[trackCode] = document.createElement("img");
    beginLoadingImage(trackpics[trackCode], fileName);
}

function loadImages() {
    var imageList = [
        {varName: warriorPic, theFile:"warrior.png"},

        {trackType: world_road, theFile:"world_road.png"},
        {trackType: world_wall, theFile:"world_wall.png"},
        {trackType: world_key, theFile:"world_key.png"},
        {trackType: world_door, theFile:"world_flag.png"},
        {trackType: world_trophy, theFile:"world_trophy.png"}
        // Objects hold several variables
    ];

    picsToLoad = imageList.length;
    // .length reads the length of the list

    for(var i=0; i<imageList.length; i++) {
        if(imageList[i].varName != undefined) {
            beginLoadingImage(imageList[i].varName, imageList[i].theFile)
        } else {
            loadImageForTrackCode(imageList[i].trackType, imageList[i].theFile)
        }
        // Checking to see if something is undefined is a very powerful tool -> it checks if something even exists. e.g does the object in imgageList have a variable(this is kinda like checking for classes honestly) varName. 
    };
}

