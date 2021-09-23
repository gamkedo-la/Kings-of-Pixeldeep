// battle-mouse vars
const MIN_DIST_TO_COUNT_DRAG = 10;
const MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE = 12;

var selectedUnits = [];

var lassoX1 = 0;
var lassoY1 = 0;
var lassoX2 = 0;
var lassoY2 = 0;
var isMouseDragging = false;

// end battle-mouse vars

function setupMouseInput() {

    canvas.addEventListener('mousemove', mousemoveHandler);

    canvas.addEventListener('mousedown', mousedownHandler);

    canvas.addEventListener('mouseup', mouseupHandler);

    canvas.addEventListener('click', clickHandler);
}

function mousemoveHandler(evt) {
    var mousePos = calculateMousePos(evt);
    setCamPanDeltas(mousePos);
    //document.getElementById("debugText2").innerHTML = "("+mousePos.x+","+mousePos.y+")";
    if(battleMode && isMouseDragging) {
        lassoX2 = mousePos.levelX;
        lassoY2 = mousePos.levelY;
    }
    if(editorMode && mouseInMainWindow(mousePos)) {
        drawHoverBox(mousePos);
        //hoverIdx = worldIdxFromMousePos(mousePos);

        /*
    } else if(hoverIdx !== null) {
        hoverIdx = null;
        */
    }
}

function mousedownHandler(evt) {
    if(battleMode) {
        var mousePos = calculateMousePos(evt);
        if(isClickInsideMainWindow(mousePos)) {
            lassoX1 = mousePos.levelX;
            lassoY1 = mousePos.levelY;
            lassoX2 = lassoX1;
            lassoY2 = lassoY1;
            isMouseDragging = true;
        }
    } 
}

function mouseupHandler(evt) {
    if(battleMode) {
        isMouseDragging = false;

        if(mouseMovedEnoughToTreatAsDragging()) {

            selectedUnits = []; // clear the selection array

            for(var i=0;i<playerUnits.length;i++) {
                if( playerUnits[i].isInBox(lassoX1,lassoY1,lassoX2,lassoY2) ) {
                    selectedUnits.push(playerUnits[i]);
                }
            }
            document.getElementById("debugText2").innerHTML = "Selected " +
                              selectedUnits.length + " units";
        } else { // mouse didn't move far, treat as click for move command
            var mousePos = calculateMousePos(evt);
            var clickedUnit = getUnitUnderMouse(mousePos);

        if(clickedUnit != null && clickedUnit.playerControlled == false) { //enemy?
            // then command units to attack it
            document.getElementById("debugText2").innerHTML = 
              "Player commands "+selectedUnits.length+" units to attack!";
            for(var i=0;i<selectedUnits.length;i++){
                selectedUnits[i].setTarget(clickedUnit);
            }
        } else {
            // didn't click enemy unit, direct any currently selected units to move
            var unitsAlongside = Math.floor(Math.sqrt(selectedUnits.length+3));
            for(var i=0;i<selectedUnits.length;i++) {
                selectedUnits[i].gotoNear(mousePos.levelX, mousePos.levelY, i, unitsAlongside);
            }
            document.getElementById("debugText2").innerHTML = 
                "Moving to ("+mousePos.levelX+","+mousePos.levelY+")";
            }
        } // end else
    } // end if(battleMode)
}



function clickHandler(evt) {
    // find out where the click was
    var mousePos = calculateMousePos(evt);

    // TODO:
    /*
    if(showCityPanel && isClickInsideCityPanel) {
        console.log("click was on city panel");
        handleCityPanelClick(mousePos);
        return;
    }
    */

    if(isClickInsideMiniMap(mousePos)) {
        console.log("click was on minimap");
        handleMiniMapClick(mousePos);
        return; // mini map clicks shouldn't select/trigger anything else
    }
    if(isClickInsideSidebar(mousePos)) {
        console.log("click was on sidebar");
        handleSidebarButtonClick(mousePos);
        return;
    }
    if(isClickInsideMainWindow(mousePos)) {
        console.log("click was on main window");
        handleMainWindowClick(mousePos);
        return;
    }
    // if click isn't in one of these areas, it must be off-canvas and we don't care about it
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // account for the margins, canvas position on page, scroll amount, etc.
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    var mouseLevelX = mouseX + camPanX;
    var mouseLevelY = mouseY + camPanY;
    //console.log( "x: "+ mouseX, "y: " + mouseY);
    return {
        x: mouseX,
        y: mouseY,
        levelX: mouseLevelX,
        levelY: mouseLevelY,
    };
}

function tileCoordToIndex(tileCol, tileRow) {
    return (tileCol + level_cols*tileRow);
}

function mouseMovedEnoughToTreatAsDragging() {
    var deltaX = lassoX1-lassoX2;
    var deltaY = lassoY1-lassoY2;
    var dragDist = Math.sqrt(deltaX*deltaX, deltaY*deltaY);
    return ( dragDist > MIN_DIST_TO_COUNT_DRAG );
}

function getUnitUnderMouse(currentMousePos) {
    var closestDistanceFoundToMouse = MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE;
    var closestUnit = null; 

    for(var i=0;i<playerUnits.length;i++) {
        var pDist = playerUnits[i].distFrom(currentMousePos.levelX, currentMousePos.levelY);
        if(pDist < closestDistanceFoundToMouse) {
            closestUnit = playerUnits[i];
            closestDistanceFoundToMouse = pDist;
        }
    }
    for(var i=0;i<enemyUnits.length;i++) {
        var eDist = enemyUnits[i].distFrom(currentMousePos.levelX, currentMousePos.levelY);
        if(eDist < closestDistanceFoundToMouse) {
            closestUnit = enemyUnits[i];
            closestDistanceFoundToMouse = eDist;
        }
    }

    return closestUnit;
}

function worldIdxFromMousePos(mousePos) {
    var tileOverCol = Math.floor( (mousePos.x) / LEVEL_TILE_W);
    var tileOverRow = Math.floor( (mousePos.y) / LEVEL_TILE_H);    

    return tileCoordToIndex(tileOverCol,tileOverRow);
}

function isClickInsideMiniMap(mousePos) {
    return isClickInBox(mousePos,

        MINI_MAP_START_X, MINI_MAP_START_Y,

        (MINI_MAP_START_X + MINI_MAP_WIDTH), (MINI_MAP_START_Y + MINI_MAP_HEIGHT),
    );
}

function isClickInsideSidebar(mousePos) {
    return isClickInBox(mousePos,

        (canvas.width - SIDEBAR_WIDTH), MINI_MAP_HEIGHT,

        canvas.width, canvas.height,
    );
}

function isClickInsideMainWindow(mousePos) {
    return isClickInBox(mousePos, 

        0,0, 

        (canvas.width - SIDEBAR_WIDTH), canvas.height,
    );
}

function isClickInBox(mousePos, x1,y1, x2,y2) {
    if(mousePos.x < x1) {
        return false;
    }
    if(mousePos.x > x2) {
        return false;
    }
    if(mousePos.y < y1) {
        return false;
    }
    if(mousePos.y > y2) {
        return false;
    }

    //console.log("click is in box", x1, y1, x2, y2);
    return true;
}

function handleMainWindowClick(mousePos) {
    if(battleMode) {
        return; 
        // mouse click in main window is only for world layer
        // mouseup and mousedown handlers take care of battle layer
    } else { 
        var clickedIdx = worldIdxFromMousePos(mousePos);

        //var tileKindClicked = levelGrid[clickedIdx];
        //console.log("tile clicked", clickedIdx, tileKindClicked);
        if(clickedIdx < 0 || clickedIdx >= levelGrid.length) { // invalid or out of bounds
            return;
        } 

        /*
        if(tileKindClicked == WORLD_GOAL) {
            //setupBattleMode();
        }
        */

    } // end else (ie - if !battleMode)
}

function mouseInMainWindow(mousePos) {
    if(mousePos.x > canvas.width - SIDEBAR_WIDTH) {
        return false;
    }

    if(mousePos.y > canvas.height) {
        return false;
    }
    
    return true;
}

/*
function highlightSquare(mousePos) {
    var hoveredIdx = worldIdxFromMousePos(mousePos);
    var hoverBoxTopX = mousePos.x;
    var hoverBoxTopY = mousePos.y;    

    outlineRect(hoverBoxTopX,hoverBoxTopY, LEVEL_TILE_W,LEVEL_TILE_H, "purple");
}
*/

function drawHoverBox(mousePos) {

    var hoverTileOverCol = Math.floor( (mousePos.x) / LEVEL_TILE_W);
    var hoverTileOverRow = Math.floor( (mousePos.y) / LEVEL_TILE_H);    

    var hoverTileX = hoverTileOverCol * LEVEL_TILE_W;
    var hoverTileY = hoverTileOverRow * LEVEL_TILE_H;

    var hoverBoxStartOffset = 0;
    if(terrainBrushSize === 3) {
        hoverBoxStartOffset = 1 * LEVEL_TILE_W;
    }
    if(terrainBrushSize === 5) {
        hoverBoxStartOffset = 2 * LEVEL_TILE_W;
    }

    var hoverBoxTopX = hoverTileX - hoverBoxStartOffset;
    var hoverBoxTopY = hoverTileY - hoverBoxStartOffset;    
    var hoverBoxW = LEVEL_TILE_W * terrainBrushSize;
    var hoverBoxH = LEVEL_TILE_H * terrainBrushSize;

    outlineRect(hoverBoxTopX,hoverBoxTopY, hoverBoxW,hoverBoxH, "purple");
}
