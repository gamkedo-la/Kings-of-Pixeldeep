const LEVEL_TILE_W = 40;
const LEVEL_TILE_H = 40;

var level_cols = 50;
var level_rows = 50;

var level_width = LEVEL_TILE_W * level_cols;
var level_height = LEVEL_TILE_H * level_rows;

var battleMode = false;
var editorMode = false;

var gameSeason = "summer";

var levelGrid = [];

// world terrain values
/*
const WORLD_ROAD = 0;
const WORLD_WALL = 1;
//const WORLD_PLAYERSTART = 2;
const WORLD_GOAL = 2;
const WORLD_FLAG = 3;
const WORLD_TREE = 4;
*/

// world terrain
const WORLD_MOUNTAINS = 1;
const WORLD_FOREST = 2;
const WORLD_GRASS = 3;
const WORLD_FARM = 4;
const WORLD_WATER = 5;

const SEASON_SUMMER = 1;
const SEASON_WINTER = 2;

// battle terrain values
//const BATTLE_GRASS = 8;

// battle terrain
const BATTLE_FIELD = 11;
const BATTLE_TREES = 12;
const BATTLE_ROCKS = 13;

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
    this.battleMode = false;
    this.editorMode = false;

    levelGrid = gameWorldGrid;
    level_cols = gameWorldCols;
    level_rows = gameWorldRows;
    level_width = LEVEL_TILE_W * level_cols;
    level_height = LEVEL_TILE_H * level_rows;

    currentSidebarButtons = WORLD_SIDEBAR_BUTTONS;
}

function setupBattleMode() {
    console.log("entering battle mode");
    this.editorMode = false;
    this.battleMode = true;
    
    // using "let" instead of "var" here to limit this variable's scope
    let pickedBattlefield = getRandomBattlefield();

    levelGrid = pickedBattlefield.grid.slice();
    level_cols = pickedBattlefield.cols;
    level_rows = pickedBattlefield.rows;
    level_width = LEVEL_TILE_W * level_cols;
    level_height = LEVEL_TILE_H * level_rows;

    currentSidebarButtons = BATTLE_SIDEBAR_BUTTONS;


    // TODO: determine player/enemy start units
    populateTeam(playerUnits, PLAYER_START_UNITS, true);
    populateTeam(enemyUnits, ENEMY_START_UNITS, false);
}

function setupEditorMode() {
    // TODO: account for battle & edit modes
    console.log("entering editor mode");
    this.battleMode = false;
    this.editorMode = true;

    levelGrid = gameWorldGrid;
    level_cols = gameWorldCols;
    level_rows = gameWorldRows;
    level_width = LEVEL_TILE_W * level_cols;
    level_height = LEVEL_TILE_H * level_rows;

    currentSidebarButtons = WORLD_EDITOR_SIDEBAR_BUTTONS;
    
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
    if (terrainCode == WORLD_FOREST){
        //check if same tile type is above
        var TILE_W = 40;
        var TILE_H = 40;
        var tileKindAbove = identifyTileAbove(arrayIndex);
        var tileKindHere = levelGrid[tileKindAbove];
        if (tileKindHere == WORLD_FOREST){
            //can now be tiles 4 through 9
            var tileKindBelow = identifyTileBelow(arrayIndex);
            tileKindHere = levelGrid[tileKindBelow];
            if(tileKindHere == WORLD_FOREST){ // must be between 4 through 6
                var tileKindToLeft = identifyTileToLeft(arrayIndex);
                tileKindHere = levelGrid[tileKindToLeft];
                if(tileKindHere == WORLD_FOREST){
                        //can be either tiles 5 or 6 
                    var tileKindToRight = identifyTileToRight(arrayIndex);
                    tileKindHere = levelGrid[tileKindToRight];
                    if(tileKindHere == WORLD_FOREST){
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
                if(tileKindHere == WORLD_FOREST){
                    //can be either tiles 8 or 9 
                    var tileKindToRight = identifyTileToRight(arrayIndex);
                    tileKindHere = levelGrid[tileKindToRight];
                    if(tileKindHere == WORLD_FOREST){
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
            if(tileKindHere == WORLD_FOREST){
                //can be either tiles 1 or 2 
                var tileKindToRight = identifyTileToRight(arrayIndex);
                tileKindHere = levelGrid[tileKindToRight];
                if(tileKindHere == WORLD_FOREST){
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
        canvasContext.drawImage(forestTerrain, 
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

