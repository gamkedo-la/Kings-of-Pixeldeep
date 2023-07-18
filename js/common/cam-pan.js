const CAM_PAN_SPEED = 10; // TODO: add to game options
const DIST_FROM_CENTER_BEFORE_PAN_X = 200;
const DIST_FROM_CENTER_BEFORE_PAN_Y = 200;

//TODO: add to game options:
const EDGE_PAN_ENABLED = true; // some people may prefer it off entirely
const EDGE_PAN_SIZE = 60; // used to be 30 
const DIST_FROM_EDGE_OF_SCREEN_BEFORE_PAN_TOP = EDGE_PAN_SIZE;
const DIST_FROM_EDGE_OF_SCREEN_BEFORE_PAN_BOTTOM = EDGE_PAN_SIZE;
const DIST_FROM_EDGE_OF_SCREEN_BEFORE_PAN_LEFT = EDGE_PAN_SIZE;
const DIST_FROM_EDGE_OF_SCREEN_BEFORE_PAN_RIGHT = EDGE_PAN_SIZE + SIDEBAR_WIDTH ;

var camPanX = 0.0;
var camPanY = 0.0;
var camPanDeltaX = 0.0;
var camPanDeltaY = 0.0;

function setCamPanDeltas(mousePos) {
  
  if (!EDGE_PAN_ENABLED) {
    camPanDeltaX = 0.0;
    camPanDeltaY = 0.0;
    return;
  }
  
  if(mousePos.x < DIST_FROM_EDGE_OF_SCREEN_BEFORE_PAN_LEFT) {
    camPanDeltaX = -CAM_PAN_SPEED;
  } else if(mousePos.x > canvas.width-DIST_FROM_EDGE_OF_SCREEN_BEFORE_PAN_RIGHT && mousePos.x < canvas.width-SIDEBAR_WIDTH) { 
        camPanDeltaX = CAM_PAN_SPEED;
  } else {
    camPanDeltaX = 0;
  }

  if(mousePos.y < DIST_FROM_EDGE_OF_SCREEN_BEFORE_PAN_TOP &&
    mousePos.x < canvas.width-SIDEBAR_WIDTH) {
    camPanDeltaY = -CAM_PAN_SPEED;
  } else if(mousePos.y > canvas.height-DIST_FROM_EDGE_OF_SCREEN_BEFORE_PAN_BOTTOM && 
      mousePos.y < canvas.height &&
      mousePos.x < canvas.width-SIDEBAR_WIDTH) {
    camPanDeltaY = CAM_PAN_SPEED;
  } else {
    camPanDeltaY = 0;
  }
    //document.getElementById("debugText").innerHTML = "("+camPanDeltaX+","+camPanDeltaY+")";
}

function cameraFollow() {
  /*
  var cameraFocusCenterX = camPanX + canvas.width/2;
  var cameraFocusCenterY = camPanY + canvas.height/2;
  //

  var playerDistFromCameraFocusX = Math.abs(sliderX-cameraFocusCenterX);
  var playerDistFromCameraFocusY = Math.abs(sliderY-cameraFocusCenterY);

  if(playerDistFromCameraFocusX > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X) {
    if(cameraFocusCenterX < sliderX)  {
      camPanX += RUN_SPEED;
    } else {
      camPanX -= RUN_SPEED;
    }
  }
  if(playerDistFromCameraFocusY > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y) {
    if(cameraFocusCenterY < sliderY)  {
      camPanY += RUN_SPEED;
    } else {
      camPanY -= RUN_SPEED;
    }
  }
  */
  if(camPanDeltaX !== 0) {
    camPanX += camPanDeltaX;
  }
  if(camPanDeltaY !== 0) {
    camPanY += camPanDeltaY;
  }

  // this next code blocks the game from showing out of bounds
  // (this isn't required, if you don't mind seeing beyond edges)
  if(camPanX < 0) {
    camPanX = 0;
    camPanDeltaX = 0;
  }
  if(camPanY < 0) {
    camPanY = 0;
    camPanDeltaY = 0;
  }

  var maxPanRight = level_cols * LEVEL_TILE_W - (canvas.width - 
    SIDEBAR_WIDTH);
  var maxPanTop = level_rows * LEVEL_TILE_H - canvas.height;

  if(camPanX > maxPanRight) {
    camPanX = maxPanRight;
    camPanDeltaX = 0;
  }
  if(camPanY > maxPanTop) {
    camPanY = maxPanTop;
    camPanDeltaY = 0;
  }
}

//TODO: the below funcs probably belong in other files
/*
function drawOnlyTilesOnScreen() {
  // what are the top-left most col and row visible on canvas?
  var cameraLeftMostCol = Math.floor(camPanX / LEVEL_TILE_W);
  var cameraTopMostRow = Math.floor(camPanY / LEVEL_TILE_H);

  // how many columns and rows of tiles fit on one screenful of area?
  var colsThatFitOnScreen = Math.floor(canvas.width / LEVEL_TILE_W);
  var rowsThatFitOnScreen = Math.floor(canvas.height / LEVEL_TILE_H);

  // finding the rightmost and bottommost tiles to draw.
  // the +1 and + 2 on each pushes the new tile popping in off visible area
  // +2 for columns since LEVEL_TILE_W doesn't divide evenly into canvas.width
  var cameraRightMostCol = cameraLeftMostCol + colsThatFitOnScreen + 2;
  var cameraBottomMostRow = cameraTopMostRow + rowsThatFitOnScreen + 1;
  
  for(var eachCol=cameraLeftMostCol; eachCol<cameraRightMostCol; eachCol++) {
    for(var eachRow=cameraTopMostRow; eachRow<cameraBottomMostRow; eachRow++) {
    
      if( isBrickAtTileCoord(eachCol, eachRow) ) {
        var brickLeftEdgeX = eachCol * LEVEL_TILE_W;
        var brickTopEdgeY = eachRow * LEVEL_TILE_H;
        colorRect(brickLeftEdgeX, brickTopEdgeY,
                 LEVEL_TILE_W - WORLD_GAP, LEVEL_TILE_H - WORLD_GAP, 'blue' );
      } // end of isBrickAtTileCoord()
    } // end of for eachRow
  } // end of for eachCol
} // end of drawBricks()

function drawEverything() {
  // drawing black to erase previous frame, doing before .translate() since
  // its coordinates are not supposed to scroll when the camera view does
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  canvasContext.save(); // needed to undo this .translate() used for scroll

  // this next line is like subtracting camPanX and camPanY from every
  // canvasContext draw operation up until we call canvasContext.restore
  // this way we can just draw them at their "actual" position coordinates
  canvasContext.translate(-camPanX,-camPanY);

  //drawBricks();
  drawOnlyTilesOnScreen();
  
  //colorCircle(sliderX, sliderY, 10, 'white');

  canvasContext.restore(); // undoes the .translate() used for cam scroll

}
*/
