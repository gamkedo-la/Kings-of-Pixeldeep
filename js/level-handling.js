const LEVEL_TILE_W = 40;
const LEVEL_TILE_H = 40;

var level_cols = 50;
var level_rows = 50;

var level_width = LEVEL_TILE_W * level_cols;
var level_height = LEVEL_TILE_H * level_rows;

var battleMode = false;
var editorMode = false;
var pauseMode = false;

var gameSeason = "summer";

var playerBattleArmy = null;
var enemyBattleArmy = null;

var levelGrid = [];

// for terrain const definitions, see js/common/global-vars.js

// these are set once per game, saved before battles and loaded after battles
var gameWorldGrid, gameWorldRows, gameWorldCols;

// these are generated new before each battle and dumped after each battle
var gameBattleGrid, gameBattleRows, gameBattleCols;


function startNewGame(whichWorld) {
    gameWorldGrid = whichWorld.grid;
    gameWorldRows = whichWorld.rows;
    gameWorldCols = whichWorld.cols;
}

function setupWorldMode() {
    console.log("entering world mode");
    battleMode = false;
    editorMode = false;

    levelGrid = gameWorldGrid;
    level_cols = gameWorldCols;
    level_rows = gameWorldRows;
    level_width = LEVEL_TILE_W * level_cols;
    level_height = LEVEL_TILE_H * level_rows;

    if (!pauseMode) {
        currentSidebarButtons = WORLD_SIDEBAR_BUTTONS;
    } else {
        setupPauseMode('world');
    }

    stopAllMusic();
    // TODO: play world background music when we have some
}

function requestWorldMode() {
    if (battleMode) {
        setupWorldMode();
    }
}

function endTurn() {
    console.log("running end turn");
    if(playerTurn) {
        turnNumber++;
    }

    playerTurn = !playerTurn;
    enemyTurn = !enemyTurn;

    for(const army of allArmies) {
        army.currentMovementPoints = army.maxMovementPoints;
    }

    for(const city of playerCities) {
        city.produceAndGrow();
    }

    if(enemyTurn) {
        runEnemyTurn();
    }
}

function setupBattleMode(worldCol, worldRow) {
    console.log("entering battle mode");
    editorMode = false;
    battleMode = true;
    
    // using "let" instead of "var" here to limit this variable's scope
    let pickedBattlefield = getRandomBattlefield();

    levelGrid = pickedBattlefield.grid.slice();
    level_cols = pickedBattlefield.cols;
    level_rows = pickedBattlefield.rows;
    level_width = LEVEL_TILE_W * level_cols;
    level_height = LEVEL_TILE_H * level_rows;

    if (!pauseMode) {
        currentSidebarButtons = BATTLE_SIDEBAR_BUTTONS;
    } else {
        setupPauseMode('battle');
    }

    if(worldCol, worldRow) {
        // find player army at given coordinates
        playerBattleArmy = playerArmies.find((army) => {
            return army.worldCol == worldCol && army.worldRow == worldRow
        });
        // find enemy army at given coordinates
        enemyBattleArmy = enemyArmies.find((army) => {
            return army.worldCol == worldCol && army.worldRow == worldRow
        });

        console.log('playerBattleArmy', playerBattleArmy, 'enemyBattleArmy', enemyBattleArmy);
        populateTeam(playerUnits, playerBattleArmy.troops.peasants, true);
        populateTeam(enemyUnits, enemyBattleArmy.troops.peasants, false);
    } else {
        let debugArmySoldiers = 20;
        console.log('starting debug battle');

        populateTeam(playerUnits, debugArmySoldiers, true);
        populateTeam(enemyUnits, debugArmySoldiers, false);
    }

    stopAllMusic();
    battleMusic.startMusic();
}

function requestBattleMode() { 
    if (!battleMode) {
        setupBattleMode();
    }
}

function resumeBattleMode() {
    console.log("resuming battle mode");
    editorMode = false;
    battleMode = true;

    levelGrid = battlefield1.grid;
    level_cols = battlefield1.cols;
    level_rows = battlefield1.rows;
    level_width = LEVEL_TILE_W * level_cols;
    level_height = LEVEL_TILE_H * level_rows;

    if (!pauseMode) {
        currentSidebarButtons = BATTLE_SIDEBAR_BUTTONS;
    } else {
        setupPauseMode('battle');
    }

    battleMusic.startMusic();
}

function setupEditorMode(battleOrWorld="world") {
    console.log("entering editor mode for:", battleOrWorld);
    editorMode = true;

    if(battleOrWorld === "battle") {
        // setup editor for battle maps
        battleMode = true;

        levelGrid = battlefield1.grid;
        level_cols = battlefield1.cols;
        level_rows = battlefield1.rows;
        level_width = LEVEL_TILE_W * level_cols;
        level_height = LEVEL_TILE_H * level_rows;

        currentSidebarButtons = BATTLE_EDITOR_SIDEBAR_BUTTONS;
    } else { 
        // setup editor for world map
        battleMode = false;

        levelGrid = gameWorldGrid;
        level_cols = gameWorldCols;
        level_rows = gameWorldRows;
        level_width = LEVEL_TILE_W * level_cols;
        level_height = LEVEL_TILE_H * level_rows;

        currentSidebarButtons = WORLD_EDITOR_SIDEBAR_BUTTONS;
    }
    
    stopAllMusic();

}

function requestEditorMode() {
    if(battleMode) {
        setupEditorMode('battle');
    } else {
        setupEditorMode('world');
    }
}

function setupPauseMode(battleOrWorld='world') {
    
    console.log("entering pause mode. editorMode is",editorMode);
    pauseMode = true

    if (!editorMode) {
        if (battleOrWorld === "battle") {
            // setup pause menu for battle maps
            currentSidebarButtons = BATTLE_PAUSE_SIDEBAR_BUTTONS;
        } else { 
            // setup pause menu for world map
            currentSidebarButtons = WORLD_PAUSE_SIDEBAR_BUTTONS;
        }
    } else {
        if (battleOrWorld === "battle") {
            console.log('battle editor in pause mode')
        } else {
            console.log('world editor in pause mode')
        }
    }

    level_width = LEVEL_TILE_W * level_cols;
    level_height = LEVEL_TILE_H * level_rows;
    
    stopAllMusic();
}

function togglePauseMode() {
    if(pauseMode) {
        if (battleMode) {
            Unpause('battle');
        } else {
            Unpause('world');
        }
    } else {
        if (battleMode) {
            setupPauseMode('battle');
        } else {
            setupPauseMode('world');
        }
    }
    console.log("pauseMode =", pauseMode);
}

function Unpause(battleOrWorld='world') {
    pauseMode = false;
    if (editorMode) {
        setupEditorMode(battleOrWorld);
    } else if (battleOrWorld === 'battle') {
        resumeBattleMode();
    } else {
        setupWorldMode();
    }
}

function getRandomBattlefield() {
    // TODO: make more battlefields and pick a random one here
    return battlefield1;
}

function returnTileTypeAtColRow(col,row) {
    if(col >= 0 && col < level_cols &&
        row >= 0 && row < level_rows) {

        var worldIndexUnderCoord = rowColToArrayIndex(col, row);
        return (levelGrid[worldIndexUnderCoord]);
    } else {
        return WORLD_WALL;
    }
}

function rowColToArrayIndex(col, row) {
        return col + level_cols * row;
}

function drawLevel() {
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

    var arrayIndex = rowColToArrayIndex(cameraLeftMostCol, cameraTopMostRow);
    var drawTileX = cameraLeftMostCol * LEVEL_TILE_W;
    var drawTileY = cameraTopMostRow * LEVEL_TILE_H;

    for(var eachRow=cameraTopMostRow;eachRow<cameraBottomMostRow;eachRow++) {
        for(var eachCol=cameraLeftMostCol;eachCol<cameraRightMostCol;eachCol++) {                
            if(arrayIndex < levelGrid.length) {
                var tileKindHere = levelGrid[arrayIndex];
                var worldIndex = arrayIndex
                if(!battleMode) {
                    drawWorldTerrain(tileKindHere, drawTileX,drawTileY, worldIndex);
                     
                    if(gameOptions.showDebug) {
                        colorText(String(arrayIndex), 
                        drawTileX,drawTileY+12, '#ff00ff');
                    }
                } else { // if battleMode
                    drawBattleTerrain(tileKindHere, drawTileX,drawTileY, worldIndex);
                    if(gameOptions.showDebug) {
                        colorText(String(arrayIndex), 
                        drawTileX,drawTileY+12, '#00ffff');
                    }
                }

                if(gameOptions.showGrid) {
                    outlineRect(drawTileX,drawTileY, 
                        LEVEL_TILE_W,LEVEL_TILE_H,
                        "black");
                }

                drawTileX += LEVEL_TILE_W;
                arrayIndex++;
            }

        } // end of for each col
    drawTileY += LEVEL_TILE_H;
    arrayIndex = rowColToArrayIndex(cameraLeftMostCol, drawTileY / LEVEL_TILE_H );
    var drawTileX = cameraLeftMostCol * LEVEL_TILE_W;
    } // end of for each row
} // end of draw level

function getSeasonMultiplier() {
  if(gameSeason === "summer") {
    return 1;
  } else if(gameSeason === "winter") {
    return 2;
  }
}

function identifyTileAbove(arrayIndex){
    return (arrayIndex - world1.rows);
}

function identifyTileBelow(arrayIndex){
    return (arrayIndex + world1.rows);
}

function identifyTileToLeft(arrayIndex){
    return arrayIndex-1;
}

function identifyTileToRight(arrayIndex){
    return (arrayIndex + 1);
}

function drawWorldTerrain(terrainCode, drawTileX, drawTileY, arrayIndex) {
    // 1, 2, 3,             Key for identifying which Forest Tile to draw on sprite
    // 4, 5, 6,
    // 7, 8, 9
    var sX = 0;
    var sY = 0;
    var terrainPic;
    if(terrainCode == WORLD_FARM){
        terrainPic = farmTerrain;
    }
    if (terrainCode == WORLD_FOREST){
        terrainPic = forestTerrain;
    }

    if (terrainCode == WORLD_WATER){
        terrainPic = coastalWaterTerrain;
        terrainCode = WORLD_WATER;
    }
    if (terrainCode == WORLD_FOREST ||
        terrainCode == WORLD_WATER ||
        terrainCode == WORLD_FARM){
        //check if same tile type is above
        var TILE_W = 40;
        var TILE_H = 40;
        var tileKindAbove = identifyTileAbove(arrayIndex);
        var tileKindHere = levelGrid[tileKindAbove];
        if (tileKindHere == terrainCode){
            //can now be tiles 4 through 9
            var tileKindBelow = identifyTileBelow(arrayIndex);
            tileKindHere = levelGrid[tileKindBelow];
            if(tileKindHere == terrainCode){ // must be between 4 through 6
                var tileKindToLeft = identifyTileToLeft(arrayIndex);
                tileKindHere = levelGrid[tileKindToLeft];
                if(tileKindHere == terrainCode){
                        //can be either tiles 5 or 6 
                    var tileKindToRight = identifyTileToRight(arrayIndex);
                    tileKindHere = levelGrid[tileKindToRight];
                    if(tileKindHere == terrainCode){
                        // ***** draw Tile 5 *****
                        sX = TILE_W * 1;
                        sY = TILE_H * 1;
                    } else {
                        //console.log("Index: " + arrayIndex + " Tile Position 6");
                        // ***** draw Tile 6 *****
                        sX = TILE_W * 2;
                        sY = TILE_H * 1;
                    }
                } else { // must be tile 4
                    // ****** draw Tile 4 ********** 
                    sX = TILE_W * 0;
                    sY = TILE_H * 1;
                }
            } else { //Must be tiles 7 through 9
                var tileKindToLeft = identifyTileToLeft(arrayIndex);
                tileKindHere = levelGrid[tileKindToLeft];
                if(tileKindHere == terrainCode){
                    //can be either tiles 8 or 9 
                    var tileKindToRight = identifyTileToRight(arrayIndex);
                    tileKindHere = levelGrid[tileKindToRight];
                    if(tileKindHere == terrainCode){
                        //console.log("Index: " + arrayIndex + " Tile Position 8");
                        // ***** draw Tile 8 *****
                        sX = TILE_W * 1;
                        sY = TILE_H * 2;
                    } else {
                        // ***** draw Tile 9 *****
                        sX = TILE_W * 2;
                        sY = TILE_H * 2;
                    }   
                } else { //identified as tile 7
                   // ***** draw Tile 7 *****
                   sX = TILE_W * 0;
                   sY = TILE_H * 2;
                } 
            }
        } else { //Must be tiles 1 though 3
            var tileKindToLeft = identifyTileToLeft(arrayIndex);
            tileKindHere = levelGrid[tileKindToLeft];
            if(tileKindHere == terrainCode){
                //can be either tiles 1 or 2 
                var tileKindToRight = identifyTileToRight(arrayIndex);
                tileKindHere = levelGrid[tileKindToRight];
                if(tileKindHere == terrainCode){
                    //console.log("Index: " + arrayIndex + " Tile Position 2");
                    // ***** draw Tile 2 *****
                    sX = TILE_W * 1;
                    sY = TILE_H * 0;
                } else {
                    // ***** draw Tile 3 *****
                    sX = TILE_W * 2;
                    sY = TILE_H * 0;
                }   
            } else { //identified as tile 1
               // ***** draw Tile 1 *****
               sX = TILE_W * 0;
               sY = TILE_H * 0;
            } // All Tiles Identified
        }
        canvasContext.drawImage(terrainPic, 
            sX, sY,
            LEVEL_TILE_W, LEVEL_TILE_H,
            drawTileX, drawTileY,
            LEVEL_TILE_W, LEVEL_TILE_H);
        return; // end forestTile
        //check if same tile type is below
    } else {
        //console.log(terrainCode + " :Not World Forest")
        var seasonMultiplier = getSeasonMultiplier();

        var worldTerrianXIndex = terrainCode * LEVEL_TILE_H;
        var worldTerrainYIndex = LEVEL_TILE_W * seasonMultiplier;
    }
    canvasContext.drawImage(worldTerrain, 
    worldTerrianXIndex,worldTerrainYIndex,
    LEVEL_TILE_W, LEVEL_TILE_H,
    drawTileX, drawTileY,
    LEVEL_TILE_W, LEVEL_TILE_H,
  );
}

function drawBattleTerrain(terrainCode, drawTileX, drawTileY, arrayIndex) {
  let battleTerrianXIndex = (terrainCode - 10) * LEVEL_TILE_H;
  let battleTerrainYIndex = LEVEL_TILE_W;

  canvasContext.drawImage(battleTerrain, 
    battleTerrianXIndex,battleTerrainYIndex,
    LEVEL_TILE_W, LEVEL_TILE_H,
    drawTileX, drawTileY,
    LEVEL_TILE_W, LEVEL_TILE_H,
  );
}
