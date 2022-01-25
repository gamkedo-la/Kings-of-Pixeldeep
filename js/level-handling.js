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

// new world terrain
const WORLD_MOUNTAINS = 1;
const WORLD_FOREST = 2;
const WORLD_GRASS = 3;
const WORLD_FARM = 4;
const WORLD_WATER = 5;

const SEASON_SUMMER = 1;
const SEASON_WINTER = 2;

// battle terrain values
//const BATTLE_GRASS = 8;

// new battle terrain
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
                if(!battleMode) {
                    drawWorldTerrain(tileKindHere, drawTileX,drawTileY);
                    if(gameOptions.showDebug) {
                        colorText(String(arrayIndex), 
                        drawTileX,drawTileY+12, '#ff00ff');
                    }
                } else { // if battleMode
                    drawBattleTerrain(tileKindHere, drawTileX,drawTileY);
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

function drawWorldTerrain(terrainCode, drawTileX, drawTileY) {
  let seasonMultiplier = getSeasonMultiplier();

  let worldTerrianXIndex = terrainCode * LEVEL_TILE_H;
  let worldTerrainYIndex = LEVEL_TILE_W * seasonMultiplier;

  canvasContext.drawImage(worldTerrain, 
    worldTerrianXIndex,worldTerrainYIndex,
    LEVEL_TILE_W, LEVEL_TILE_H,
    drawTileX, drawTileY,
    LEVEL_TILE_W, LEVEL_TILE_H,
  );
}

function drawBattleTerrain(terrainCode, drawTileX, drawTileY) {
  let battleTerrianXIndex = (terrainCode - 10) * LEVEL_TILE_H;
  let battleTerrainYIndex = LEVEL_TILE_W;

  canvasContext.drawImage(battleTerrain, 
    battleTerrianXIndex,battleTerrainYIndex,
    LEVEL_TILE_W, LEVEL_TILE_H,
    drawTileX, drawTileY,
    LEVEL_TILE_W, LEVEL_TILE_H,
  );
}

