
// Split code into multiple files so its easier to manage and organize
// This is the file for the graphics functions (btw a lot of these functions can be reused for other games)

function drawBitMapCenteredWithRotation(useBitmap, atX, atY, withAng) {
    // useBitmap is the img used
    canvas_context.save();
    // How js drawing works is that "settings" of the canvas are set and those are automattically applied to future draw methods. For example if canvas_context.fillStyle(); is set to green the next thing drawn will be green. The save method saves the current settings (here it saves the normal non-crazy rotation settings so that future drawing is not affected by the settings change) so that they can be restored later by the canvas_context.restore(); method
    canvas_context.translate(atX,atY);
    // The .translate(); method moves the (0,0) coordinates of the canvas to the coordinates inputted (here it moves them to the center of the car for the rotate function to work as intended) 
    canvas_context.rotate(withAng);
    // The .rotate(inputted degrees rotated in radians); method makes all future draw methods be rotated around the (0,0) point of the canvas. (here the (0,0) point is placed on the car temporarily so the car rotates itself and not around another point)
    canvas_context.drawImage(useBitmap, -useBitmap.width/2,-useBitmap.height/2);
    // .drawImage takes parameters image(needs src) and x & y coordinates 
    canvas_context.restore();
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
}
