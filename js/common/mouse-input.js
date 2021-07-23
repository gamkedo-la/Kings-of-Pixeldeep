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
  //document.getElementById("debugText").innerHTML = "("+mousePos.x+","+mousePos.y+")";
  if(battleMode && isMouseDragging) {
    lassoX2 = mousePos.x;
    lassoY2 = mousePos.y;
  }
}

function mousedownHandler(evt) {
  if(battleMode) {
    var mousePos = calculateMousePos(evt);
    lassoX1 = mousePos.x;
    lassoY1 = mousePos.y;
    lassoX2 = lassoX1;
    lassoY2 = lassoY1;
    isMouseDragging = true;
  } 
}

function mouseupHandler(evt) {
  isMouseDragging = false;

  if(mouseMovedEnoughToTreatAsDragging()) {
    
    selectedUnits = []; // clear the selection array

    for(var i=0;i<playerUnits.length;i++) {
      if( playerUnits[i].isInBox(lassoX1,lassoY1,lassoX2,lassoY2) ) {
        selectedUnits.push(playerUnits[i]);
      }
    }
    document.getElementById("debugText").innerHTML = "Selected " +
                          selectedUnits.length + " units";
  } else { // mouse didn't move far, treat as click for move command
    var mousePos = calculateMousePos(evt);
    var clickedUnit = getUnitUnderMouse(mousePos);

    if(clickedUnit != null && clickedUnit.playerControlled == false) { //enemy?
      // then command units to attack it
      document.getElementById("debugText").innerHTML = 
          "Player commands "+selectedUnits.length+" units to attack!";
      for(var i=0;i<selectedUnits.length;i++){
        selectedUnits[i].setTarget(clickedUnit);
      }
    } else {
      // didn't click enemy unit, direct any currently selected units to move
      var unitsAlongside = Math.floor(Math.sqrt(selectedUnits.length+3));
      for(var i=0;i<selectedUnits.length;i++) {
        selectedUnits[i].gotoNear(mousePos.x, mousePos.y, i, unitsAlongside);
      }
      document.getElementById("debugText").innerHTML = 
        "Moving to ("+mousePos.x+","+mousePos.y+")";
    }
  }
}



function clickHandler(evt) {
    if(battleMode) {
      return // mouse click event is only for world layer
    } else { 
      // find out where the click was
      var mousePos = calculateMousePos(evt);
      // TODO: going to have to set 3 layers up:
      //      - game world (ie - terrain tiles)
      //      - features (ie - cities, units/armies)
    //            - Ok, this one doesn't really have to be a grid,
    //                we can just say "entity A is at B world idx (or X,Y),
    //                and draw it that way. This way each city/unit can still
    //                be a unique entity and we don't have to dedicate a 
    //                mostly-empty grid array to unit and city positions 
      //      - UI (main window bar, popup windows, etc)
      //      
      //      mouse click is going to need to check for each one in reverse order, unless moving a unit
      var clickedIdx = worldIdxFromMousePos(mousePos);

      var tileKindClicked = levelGrid[clickedIdx];
      //console.log("tile clicked", clickedIdx, tileKindClicked);
      if(clickedIdx < 0 || clickedIdx >= levelGrid.length) { // invalid or out of bounds
	return;
      } 

      if(tileKindClicked == WORLD_GOAL) {
        setupBattleMode();
      }

      /*
      // is click on a board tile?
      if(BOARD_TILES.includes(tileKindClicked)) {
	//console.log("Clicked a board tile");
	if(turnStage === 'move') {
	  if(selectedIdx == -1 || currentPlayerPieceList.includes(clickedIdx)) {
	    tryToSelectPiece(clickedIdx);
	  } else { 
	    tryToMoveSelectedPiece(clickedIdx);
	  }
	}
	//resolveBoardClick(selectedIdx);
      }
	  */
    } // end else (ie - if !battleMode)
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // account for the margins, canvas position on page, scroll amount, etc.
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
      x: mouseX,
      y: mouseY
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
    var pDist = playerUnits[i].distFrom(currentMousePos.x, currentMousePos.y);
    if(pDist < closestDistanceFoundToMouse) {
      closestUnit = playerUnits[i];
      closestDistanceFoundToMouse = pDist;
    }
  }
  for(var i=0;i<enemyUnits.length;i++) {
    var eDist = enemyUnits[i].distFrom(currentMousePos.x, currentMousePos.y);
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
