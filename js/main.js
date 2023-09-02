var playerTurn = true;
var enemyTurn = false;

// to handle Chrome pause on start audio
const USER_INTERACT_STAGE_NONE = 0;
const USER_INTERACT_STAGE_START = 1;
const USER_INTERACT_STAGE_CONTINUED = 2;
var userInteractStage = USER_INTERACT_STAGE_NONE;

var sliderTest = new sliderClass({
    x: 300,
    y: 300,
});

window.onload = function() {
    colorRect(0,0, canvas.width,canvas.height, "black");
    colorText("Loading...", canvas.width/2,canvas.height/2, "white");

    loadImages();
    loadSounds();
}

function imageLoadingDoneSoStartGame() {
    var framesPerSecond = 30;
    setInterval(updateAll, 1000/framesPerSecond);

    setupMouseInput();
    setupKeyboardInput();
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

    if(battleMode && !pauseMode) {
        // Allow all units to move in battle mode
        for(var i=0;i<allUnits.length;i++) {
            allUnits[i].move();
        }
        for(var i=0;i<allUnits.length;i++) {
            allUnits[i].checkForCollisions();
        }
        /*
        if(playerTurn){
            for(var i=0;i<playerUnits.length;i++) {
                playerUnits[i].move();
            }
        }
        if(enemyTurn){
            for(var i=0;i<enemyUnits.length;i++) {
                enemyUnits[i].move();
            }
        }
        */
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
            // battle drag box, uses world coords
            coloredOutlineRectCornerToCorner(lassoX1,lassoY1, lassoX2,lassoY2, 'yellow');
        }
    }

    canvasContext.restore(); // undoes the .translate() used for cam scroll

    drawUI();
    /*
    if(showCityPanel && isMouseDragging) {
        // city panel drag box, uses screen coords
        coloredOutlineRectCornerToCorner(lassoX1,lassoY1, lassoX2,lassoY2, 'blue');
    }
    */


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
    drawSidebar();
    drawMiniMap();
    drawTopbar();

    if(editorMode) {
        drawHoverBox();
    }

    if(!battleMode && showCityPanel) {
        drawCityPanel();
    }

    if(!battleMode && showCreateArmyScreen) {
        drawCreateArmyScreen();
    }

    if(showSliderTest) {
        sliderTest.draw();
    }
}

function drawCitiesAndArmies() {
// cities
for(var i=0;i<enemyCities.length;i++) {
    enemyCities[i].draw();
}
for(var i=0;i<playerCities.length;i++) {
    playerCities[i].draw();
}
for(var i=0;i<neutralCities.length;i++) {
    neutralCities[i].draw();
}

// armies
for(var i=0;i<enemyArmies.length;i++) {
    enemyArmies[i].draw();
}
for(var i=0;i<playerArmies.length;i++) {
    playerArmies[i].draw();
}

    
}

function debug(text) {
    if(gameOptions.showDebug) {
        document.getElementById('debugText').innerHTML = text;
    }
}

function camDebug() {
    if(gameOptions.showDebug) {
        document.getElementById('debugText2').innerHTML = 
            `CamPan: (${camPanX},${camPanY}) <br>
            CamPanDelta: (${camPanDeltaX},${camPanDeltaY}) <br>`;
            //"CamPan: ("+ camPanX + "," + camPanY ") <br>" +
            //"CamPanDelta: ("+ camPanDeltaX +","+ camPanDeltaY + ") <br>";
    }
}

function toggleUserInteractStage() {
    if (userInteractStage === USER_INTERACT_STAGE_NONE) {
        userInteractStage = USER_INTERACT_STAGE_START;
        playStartupMusic();
    } else if (userInteractStage === USER_INTERACT_STAGE_START) {
        userInteractStage = USER_INTERACT_STAGE_CONTINUED;
    }
}
