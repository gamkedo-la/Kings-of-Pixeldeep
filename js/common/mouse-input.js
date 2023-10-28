const TEST_PATHFINDING = true; // work in progress for unity and army obstacle avoidance

// battle-mouse vars
const MIN_DIST_TO_COUNT_DRAG = 10;
const MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE = 12;

var selectedUnits = [];

var lassoX1 = 0;
var lassoY1 = 0;
var lassoX2 = 0;
var lassoY2 = 0;
var isMouseDragging = false; // left drag to region select
var currentMousePos = { x:0,y:0 }; // stored for use in code outside the mouse event such as the GUI

const MOUSE_MAP_PAN_ENABLED = true; // TODO; put in options
const maxMouseMapPanDistToBeAClick = 20; // don't confuse a right-drag with a right-click
var isMouseMapPanning = false; // right drag to pan map
var currentMouseMapPanDist = 0;

// end battle-mouse vars

function setupMouseInput() {

    canvas.addEventListener('mousemove', mousemoveHandler);

    canvas.addEventListener('mousedown', mousedownHandler);

    canvas.addEventListener('mouseup', mouseupHandler);

    canvas.addEventListener('click', clickHandler);

    canvas.addEventListener('contextmenu', rightClickHandler);

    canvas.addEventListener('mouseleave', mouseleaveHandler);
}

function mousemoveHandler(evt) {

    if (MOUSE_MAP_PAN_ENABLED && isMouseMapPanning) {
        //lerp camPanX and camPanY towards mouse position
        function lerp(a,b,t) { return a+(b-a)*t; }
        const lerpFactor = 0.6;
        camPanX = lerp(camPanX, camPanX-evt.movementX, lerpFactor);
        camPanY = lerp(camPanY, camPanY-evt.movementY, lerpFactor);

        // round to nearest pixel
        camPanX = Math.round(camPanX);
        camPanY = Math.round(camPanY);

       // camPanX -= evt.movementX;
       // camPanY -= evt.movementY;
        currentMouseMapPanDist += Math.sqrt(evt.movementX*evt.movementX+evt.movementY*evt.movementY);
    }

    var mousePos = calculateMousePos(evt);
    
    // so the GUI knows where the mouse is
    currentMousePos.x = mousePos.x;
    currentMousePos.y = mousePos.y;

    setCamPanDeltas(mousePos);
    if(gameOptions.showDebug) {
        debug("mousePos: (" + mousePos.x +","+ mousePos.y +")");
        //document.getElementById("debugText2").innerHTML = "("+mousePos.x+","+mousePos.y+")";
    }
    if(isMouseDragging) {
        if(battleMode) {
            lassoX2 = mousePos.levelX;
            lassoY2 = mousePos.levelY;
        } /*else if(showCityPanel) {
            lassoX2 = mousePos.x;
            lassoY2 = mousePos.y;
        }
        */
    }
    if(editorMode && mouseInMainWindow(mousePos)) {
        //drawHoverBox(mousePos);
        hoverPos = mousePos;// see editor.js for hoverPos usage
    } else if(selectedWorldEntity) {
        hoverPos = mousePos;

        if (selectedWorldEntity && selectedWorldEntity instanceof armyClass) {
            // map tile coordinates
            let ax = selectedWorldEntity.worldCol;
            let ay = selectedWorldEntity.worldRow;
            let bx = Math.floor( (mousePos.levelX) / LEVEL_TILE_W);
            let by = Math.floor( (mousePos.levelY) / LEVEL_TILE_H);    
            let path = levelGridPathfind(ax,ay,bx,by);
            if (path && path[0]) {
                console.log("levelGridPathfind result: "+JSON.stringify(path));
            } else {
                console.log("levelGridPathfind found NO path possible.");
            }
            selectedWorldEntity.setMovementPath(path);

            currentSidebarLabels = WORLD_SIDEBAR_LABELS;
            selectedWorldEntityLabel.text = String(selectedWorldEntity.name);
            movementPointsLabel.text = MOVEMENT_POINTS + String(selectedWorldEntity.currentMovementPoints - selectedWorldEntity.currentPath.length);
            if (selectedWorldEntity instanceof armyClass) {
                selectedArmyUnitCountLabel.text = 
                    SELECTED_ARMY_UNIT_COUNT + String(selectedWorldEntity.troopCount());
            }
            
        }
    } else if(hoverPos !== null) {
        hoverPos = null;
    }

    if(showSliderTest && sliderTest.isDragging) {

        sliderTest.mousemoveHandler(mousePos);
    }

    if(showCityPanel) {
        handleCityPanelMousemove(mousePos);
    }

    if(showCreateArmyScreen) {
        // Index 1 is the pctOfPopulation slider object
        var pctOfPopulation = createArmyScreenControls[1]; 
        if(pctOfPopulation != null && pctOfPopulation.isDragging) {
            pctOfPopulation.mousemoveHandler(mousePos);
        }
    }
}

function mousedownHandler(evt) {
    toggleUserInteractStage();
    
    if (MOUSE_MAP_PAN_ENABLED && evt.button==2) { // right mouse button
        //console.log("starting a right-drag mouse map pan");
        isMouseMapPanning = true;
        currentMouseMapPanDist = 0; // reset
        return; // don't run any code below
    }
    
    var mousePos = calculateMousePos(evt);

    if(battleMode && !editorMode) {
        if(isClickInsideMainWindow(mousePos)) {
            if(battleMode) {
                lassoX1 = mousePos.levelX;
                lassoY1 = mousePos.levelY;
            } /*else if(showCityPanel) {
                lassoX1 = mousePos.x;
                lassoY1 = mousePos.y;
            }
            */

            lassoX2 = lassoX1;
            lassoY2 = lassoY1;
            isMouseDragging = true;
        }
    } 

    if(showSliderTest && isClickInBox(mousePos,
        sliderTest.x,sliderTest.y, 
        sliderTest.x + sliderTest.width,
        sliderTest.y + sliderTest.height)) {

        sliderTest.mousedownHandler();
    }
    if(showCityPanel) { 
        var mousePos = calculateMousePos(evt);
        if(isClickInBox(mousePos,
            CITY_PANEL_X, CITY_PANEL_Y, 
            CITY_PANEL_X + CITY_PANEL_W,
            CITY_PANEL_Y + CITY_PANEL_H)) {

            handleCityPanelMousedown(mousePos);
        }
    }
    if(showCreateArmyScreen) { 
        var mousePos = calculateMousePos(evt);
        if(isClickInBox(mousePos,
            CREATE_ARMY_SCREEN_X, CREATE_ARMY_SCREEN_Y, 
            CREATE_ARMY_SCREEN_X + CREATE_ARMY_SCREEN_W,
            CREATE_ARMY_SCREEN_Y + CREATE_ARMY_SCREEN_H)) {

            handleCreateArmyScreenMousedown(mousePos);
        }
    }
}

function mouseupHandler(evt) {
    toggleUserInteractStage();

    if (MOUSE_MAP_PAN_ENABLED && evt.button==2) { // right mouse button
        //console.log("ending a right-drag mouse map pan");
        isMouseMapPanning = false;
        //currentMouseMapPanDist = 0; // gets reset when we start the next one
        return; // don't run any code below
    }
    
    if(battleMode && !editorMode) {
        isMouseDragging = false;

        if(mouseMovedEnoughToTreatAsDragging()) {

            if(battleMode) {
                // maybe move this to a "handle box selection" function 
                // with units & selected arrays???
                selectedUnits = []; // clear the selection array

                for(var i=0;i<playerUnits.length;i++) {
                    if( playerUnits[i].isInBox(lassoX1,lassoY1,lassoX2,lassoY2) ) {
                        selectedUnits.push(playerUnits[i]);
                    }
                }
                if(gameOptions.showDebug) {
                    document.getElementById("debugText2").innerHTML = "Selected " +
                                      selectedUnits.length + " units";
                }
            } /*else if(showCityPanel) {
                selectedCityWorkers = [];
                
                for(var i=0;i<cityWorkers.length;i++) {
                    if( cityWorkers[i].isInBox(lassoX1,lassoY1,lassoX2,lassoY2) ) {
                        selectedCityWorkers.push(cityWorkers[i]);
                    }
                }

            }
            */
        } else { // mouse didn't move far, treat as click
            // if left click, deselect units
            if(evt.button == 0) {
                selectedUnits = [];
            }
            // ( right click is handled in rightClickHandler() )
            
        } // end else (!mouseMovedEnoughToTreatAsDragging)

        // update selected unit count display in the sidebar
        selectedUnitCountLabel.text = SELECTED_UNITS + String(selectedUnits.length);

    } // end if(battleMode)

    if(showSliderTest) { 
        var mousePos = calculateMousePos(evt);
        if(isClickInBox(mousePos,
            sliderTest.x, sliderTest.y, 
            sliderTest.x + sliderTest.width,
            sliderTest.y + sliderTest.height)) {

            sliderTest.mouseupHandler(mousePos);
        }
    }

    if(showCityPanel) { 
        var mousePos = calculateMousePos(evt);
        if(isClickInBox(mousePos,
            CITY_PANEL_X, CITY_PANEL_Y, 
            CITY_PANEL_X + CITY_PANEL_W,
            CITY_PANEL_Y + CITY_PANEL_H)) {

            handleCityPanelMouseup(mousePos);
        }
        // always let go of all sliders on mouseup
        cityPanelControls[1].mouseupHandler(evt);
    }

    if(showCreateArmyScreen) { 
        console.log('click is in create army screen');
        var mousePos = calculateMousePos(evt);
        if(isClickInBox(mousePos,
            CREATE_ARMY_SCREEN_X, CREATE_ARMY_SCREEN_Y, 
            CREATE_ARMY_SCREEN_X + CREATE_ARMY_SCREEN_W,
            CREATE_ARMY_SCREEN_Y + CREATE_ARMY_SCREEN_H)) {

            handleCreateArmyScreenMouseup(mousePos);
        }
    }
}

function findClickedCitySectionIdx(mousePos) {
    for(var i=0;i<CITY_SECTIONS.length;i++) {
        if( isClickInBox(mousePos, CITY_SECTIONS[i].minX, CITY_SECTIONS[i].minY,
            CITY_SECTIONS[i].maxX, CITY_SECTIONS[i].maxY) ) {
            //console.log("click was in " + CITY_SECTIONS[i].name);
            return i;
            break;
        }
    }
}


function clickHandler(evt) {
    toggleUserInteractStage();
    // find out where the click was
    var mousePos = calculateMousePos(evt);

    if(mainMenuMode) {
        handleMainMenuClick(mousePos);
        return;
    }

    if(showCityPanel && isClickInsideCityPanel(mousePos)) {
        //console.log("click was on city panel", mousePos.x, mousePos.y);
        handleCityPanelClick(mousePos);
        return;
    } 
    if(showCityPanel && !isClickInsideCityPanel(mousePos)) {
        this.showCityPanel = false;
    }

    if(isClickInsideMiniMap(mousePos)) {
        //console.log("click was on minimap");
        handleMiniMapClick(mousePos);
        return; // mini map clicks shouldn't select/trigger anything else
    }
    if(isClickInsideSidebar(mousePos)) {
        //console.log("click was on sidebar");
        handleSidebarButtonClick(mousePos);
        return;
    }
    if(isClickInsideMainWindow(mousePos)) {
        //console.log("click was on main window");
        handleMainWindowClick(mousePos, evt);
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
    var tileOverCol = Math.floor( (mousePos.levelX) / LEVEL_TILE_W);
    var tileOverRow = Math.floor( (mousePos.levelY) / LEVEL_TILE_H);    

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
    if(mousePos.x==undefined || mousePos.y==undefined) {
        console.log("error: invalid mousePos given for isClickInBox");
        return false;
    }

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

function handleMainWindowClick(mousePos, evt) {
    console.log(evt);
    if(battleMode && !editorMode) {
        return; 
        // mouseup, mousedown, & rightClick handlers take care of most battle layer stuff
    } 

    var clickedIdx = worldIdxFromMousePos(mousePos);
    //var tileKindClicked = [clickedIdx];
    //console.log("tile clicked", clickedIdx);
    if(clickedIdx < 0 || clickedIdx >= levelGrid.length) { // invalid or out of bounds
        return;
    } 

    if(editorMode) {
        replaceTerrain(clickedIdx);
    }

    if(!battleMode && !editorMode) { // ie - if worldMode
        for(var i=0;i<playerCities.length;i++) {
            if(playerCities[i].worldIdx() == clickedIdx) {
                //console.log("clicked on ", playerCities[i].name);
                //openCityPanel(playerCities[i]);
                selectedWorldEntity = playerCities[i];
                currentSidebarLabels = CITY_SIDEBAR_LABELS;
                currentSidebarButtons = CITY_SIDEBAR_BUTTONS;
            }
        }

        if(selectedWorldEntity === null || !(selectedWorldEntity instanceof armyClass)) {
            for(var i=0;i<playerArmies.length;i++) {
                if(playerArmies[i].worldIdx() == clickedIdx) {
                    selectedWorldEntity = playerArmies[i];
                    selectedWorldEntityIndex = i;
                }
            }
        } 

        if(selectedWorldEntity instanceof armyClass) {
            selectedWorldEntity.move(clickedIdx);
            // NOTE: code for right-click to deselect army is in 
            // rightClickHandler() function
        }

    }

    /*
    if(tileKindClicked == WORLD_GOAL) {
        //setupBattleMode();
    }
    */


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

function isClickInsideCityPanel(mousePos) {
    return isClickInBox(mousePos, 
        CITY_PANEL_X, CITY_PANEL_Y,
        CITY_PANEL_X + CITY_PANEL_W, CITY_PANEL_Y + CITY_PANEL_H
    );
}

function attackOrMoveToMousePos(evt) {
    var mousePos = calculateMousePos(evt);
    var clickedUnit = null;

    if(battleMode) {
        clickedUnit = getUnitUnderMouse(mousePos);
    }

    if(clickedUnit != null && clickedUnit.playerControlled == false) { //enemy?
        // then command units to attack it
        if(gameOptions.showDebug) {
            document.getElementById("debugText2").innerHTML = 
              "Player commands "+selectedUnits.length+" units to attack!";
        }
        for(var i=0;i<selectedUnits.length;i++){
            selectedUnits[i].setTarget(clickedUnit);
        }
    } else {
        // didn't click enemy unit, direct any currently selected units to move
        if(battleMode) {
            var unitsAlongside = Math.floor(Math.sqrt(selectedUnits.length+3));
            for(var i=0;i<selectedUnits.length;i++) {
                selectedUnits[i].gotoNear(mousePos.levelX, mousePos.levelY, i, unitsAlongside);
            }
            if(gameOptions.showDebug) {
                document.getElementById("debugText2").innerHTML = 
                    "Moving to ("+mousePos.levelX+","+mousePos.levelY+")";
            }
        } /*else if(showCityPanel) { 
            if(isClickInsideCityPanel(mousePos)) {
                //find out which section click is in.
                var clickedCitySection = findClickedCitySectionIdx(mousePos);
                for(var i=0;i<selectedCityWorkers.length;i++) {
                    selectedCityWorkers[i].moveTo(clickedCitySection);
                }
                // city workers are de-selected once moved
                selectedCityWorkers = [];
            }
            
        } // end else (if showCityPanel)
        */

    } // end else (clickedUnit == null && !clickedUnit.playerControlled == false)

} // end function attackOrMoveToMousePos()

function rightClickHandler(evt) {
    evt.preventDefault();
    toggleUserInteractStage();

    if(battleMode) {
        // if right mouse is released after a right-drap map pan, we don't also want to move there,
        // so ignore if we dragged more than a tiny amount to account for mouse wobbles during a click
        if (MOUSE_MAP_PAN_ENABLED&&(currentMouseMapPanDist>maxMouseMapPanDistToBeAClick)) {
            //console.log("right click ignored because it was the end of a map pan drag. currentMouseMapPanDist="+currentMouseMapPanDist);
        } else {
            attackOrMoveToMousePos(evt);
        }
    }

    if(!battleMode && !editorMode) {
        // right clicking while an army (or city) is selected in world mode deselects it
        if(selectedWorldEntity) {
            deselectWorldEntity();
        }
    } // end if
} // end function

function selectNextAvailableArmy() {
    if(!battleMode && !editorMode) {
        if(selectedWorldEntity && selectedWorldEntity instanceof armyClass && !(selectedWorldEntity instanceof cityClass)) {
            deselectWorldEntity();

            selectedWorldEntityIndex++;
            if (selectedWorldEntityIndex > playerArmies.length - 1) {
                selectedWorldEntityIndex = 0;
            } 
            selectedWorldEntity = playerArmies[selectedWorldEntityIndex];

            // focus camera on selected army
            camPanX = selectedWorldEntity.x() - canvas.width / 2;
            camPanY = selectedWorldEntity.y() - canvas.height / 2;
        } 
    }
}

function deselectWorldEntity() {
    if(selectedWorldEntity) {
        console.log('deselecting', selectedWorldEntity);
        selectedWorldEntity.currentPath = null;
        selectedWorldEntity = null;
        currentSidebarLabels = currentSidebarLabels.filter(
            label => label in WORLD_SIDEBAR_LABELS
        );
        // restore default sidebar buttons
        currentSidebarButtons = WORLD_SIDEBAR_BUTTONS;
    }
}

function mouseleaveHandler(evt) {
    camPanDeltaX = 0;
    camPanDeltaY = 0;

    if(isMouseDragging) {
        mouseupHandler(evt);
    }
}
