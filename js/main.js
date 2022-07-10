var canvas, canvasContext;

// TODO: put in a game preferences object
var gameOptions = {
    showGrid: false,
    showDebug: true,
}

var sliderTest = new sliderClass({
    x: 300,
    y: 300,
});

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
    if(editorMode) {
        drawHoverBox();
    }
    if(!battleMode && showCityPanel) {
        drawCityPanel();
    }
    if(showSliderTest) {
        sliderTest.draw();
    }
}

function drawCitiesAndArmies() {
for(var i=0;i<playerCities.length;i++) {
    playerCities[i].draw();
}
for(var i=0;i<playerArmies.length;i++) {
    playerArmies[i].draw();
}
// TODO: draw enemy cities and armies
    
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

