var canvas, canvasContext;

// TODO: new method for pre-populating maps (racing game?)
var venice = new cityClass();
  venice.name = "venice";
  venice.setPosition(0,0);
var paris  = new cityClass();
  paris.name = "venice";
  paris.setPosition(2,4);
var army1  = new armyClass();
  army1.setPosition(5,5);

// TODO: move to UI file when we make that one
const SIDEBAR_WIDTH = 200;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
    
  colorRect(0,0, canvas.width,canvas.height, "black");
  colorText("Loading...", canvas.width/2,canvas.height/2, "white");

  loadImages();
  //loadSounds();

}

function imageLoadingDoneSoStartGame() {
  var framesPerSecond = 30;
  setInterval(updateAll, 1000/framesPerSecond);

  setupMouseInput();
  startNewGame(world1);
  setupWorldMode();
  //setupBoard();
}

function updateAll() {
  moveEverything();
  drawEverything();
}

function moveEverything() {
  cameraFollow();
  camDebug();

  if(battleMode) {
    for(var i=0;i<allUnits.length;i++) {
      allUnits[i].move();
    }
    removeDeadUnits();
    checkAndHandleVictory();
  }
}

function drawEverything() {
  // drawing black to erase previous frame, doing before .translate() since
  // its coordinates are not supposed to scroll when the camera view does
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  canvasContext.save(); // needed to undo this .translate() used for scroll

  // this next line is like subtracting camPanX and camPanY from every
  // canvasContext draw operation up until we call canvasContext.restore
  // this way we can just draw them at their "actual" position coordinates
  canvasContext.translate(-camPanX,-camPanY);

  drawLevel();

  if(!battleMode) {
    drawCitiesAndArmies();
  } else {
    drawUnits();

    if(isMouseDragging) {
      coloredOutlineRectCornerToCorner(lassoX1,lassoY1, lassoX2,lassoY2, 'yellow');
    }
  }

  canvasContext.restore(); // undoes the .translate() used for cam scroll

  drawUI();
}

function drawUnits() {
  for(var i=0;i<allUnits.length;i++) {
    allUnits[i].draw();
  }

  for(var i=0;i<selectedUnits.length;i++) {
    selectedUnits[i].drawSelectionBox();
  }

}

function drawUI() {
  colorRect(canvas.width-SIDEBAR_WIDTH,0, SIDEBAR_WIDTH,canvas.height, 'grey');
  drawMiniMap();
}

function drawCitiesAndArmies() {
  venice.draw();
  paris.draw();
  army1.draw();
}

function debug(text) {
  //document.getElementById('debugText').innerHTML = text;
}

function camDebug() {
  document.getElementById('debugText').innerHTML = 
    `CamPan: (${camPanX},${camPanY}) <br>
    CamPanDelta: (${camPanDeltaX},${camPanDeltaY}) <br>`;
    //"CamPan: ("+ camPanX + "," + camPanY ") <br>" +
    //"CamPanDelta: ("+ camPanDeltaX +","+ camPanDeltaY + ") <br>";
}

