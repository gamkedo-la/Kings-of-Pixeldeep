function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function outlineRect(topLeftX, topLeftY, boxWidth, boxHeight, lineColor) {
  canvasContext.strokeStyle = lineColor;
  canvasContext.beginPath();
  canvasContext.rect(topLeftX, topLeftY, boxWidth, boxHeight);
  canvasContext.stroke();
}

function coloredOutlineRectCornerToCorner(corner1X, corner1Y, corner2X, corner2Y, lineColor) {
  canvasContext.strokeStyle = lineColor;
  canvasContext.beginPath();
  canvasContext.rect(corner1X, corner1Y, corner2X-corner1X, corner2Y-corner1Y);
  canvasContext.stroke();
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}
  
function drawBitmapCenteredWithRotation(graphic, atX, atY,withAngle) {
  canvasContext.save(); // allows us to undo translate movement and rotate spin
  canvasContext.translate(atX,atY); // sets the point where our graphic will go
  canvasContext.rotate(withAngle); // sets the rotation
  canvasContext.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
  canvasContext.restore(); // undo the translation movement and rotation since save()
}

function drawBitmapPartialCenteredWithRotation(graphic, atX, atY, dWidth, dHeight, withAngle, sX, sY, sWidth, sHeight) {
  canvasContext.save(); // allows us to undo translate movement and rotate spin
  canvasContext.translate(atX,atY); // sets the point where our graphic will go
  canvasContext.rotate(withAngle); // sets the rotation
  canvasContext.drawImage(graphic,sX,sY,sWidth,sHeight,
    -dWidth/2,-dHeight/2,dWidth,dHeight); // center, draw partial
  canvasContext.restore(); // undo the translation movement and rotation since save()
}

function colorText(showWords, textX,textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX,textY);
}

function colorTextShadow(showWords, textX,textY, fillColor) {
    colorText(showWords,textX+1,textY+1,"black")
    colorText(showWords,textX,textY,fillColor)
}

function drawText(fontSize, color, textAlign, text, x, y){
  canvasContext.save();
  canvasContext.textBaseline = "top";
  //canvasContext.font = fontSize+"pt sens-serif"; // <---- old font
  canvasContext.font = fontSize+"pt " + CUSTOM_WEBFONT_NAME; // <------- webfont
  canvasContext.fillStyle = color;
  canvasContext.textAlign = textAlign;
  canvasContext.fillText(text, x, y);
  canvasContext.restore();
}
