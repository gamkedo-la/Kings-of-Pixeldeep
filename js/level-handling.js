const LEVEL_TILE_W = 40;
const LEVEL_TILE_H = 40;

var level_cols = 50;
var level_rows = 50;

var battleMode = false;

var levelGrid = [];

// world terrain values
const WORLD_ROAD = 0;
const WORLD_WALL = 1;
//const WORLD_PLAYERSTART = 2;
const WORLD_GOAL = 2;
const WORLD_FLAG = 3;
const WORLD_TREE = 4;

// battle terrain values
const BATTLE_GRASS = 8;

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
    this.battleMode = false;

    levelGrid = gameWorldGrid;
    level_cols = gameWorldCols;
    level_rows = gameWorldRows;
}

function setupBattleMode() {
    this.battleMode = true;
    
    // using "let" instead of "var" here to limit this variable's scope
    let pickedBattlefield = getRandomBattlefield();

    levelGrid = pickedBattlefield.grid.slice();
    level_cols = pickedBattlefield.cols;
    level_rows = pickedBattlefield.rows;


    // TODO: determine player/enemy start units
    populateTeam(playerUnits, PLAYER_START_UNITS, true);
    populateTeam(enemyUnits, ENEMY_START_UNITS, false);
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
                  var useImg = worldPics[tileKindHere];
                  canvasContext.drawImage(useImg, drawTileX,drawTileY);
                  if(!battleMode) {
                    colorText(String(arrayIndex), drawTileX,drawTileY+12, '#00ff00');
                  } else {
                    colorText(String(arrayIndex), drawTileX,drawTileY+12, '#00ffff');
                  }
                  
                  drawTileX += LEVEL_TILE_W;
                  arrayIndex++;
                }

        } // end of for each col
    drawTileY += LEVEL_TILE_H;
    arrayIndex = rowColToArrayIndex(cameraLeftMostCol, drawTileY / LEVEL_TILE_H );
    var drawTileX = cameraLeftMostCol * LEVEL_TILE_W;
    } // end of for each row
} // end of draw worlds
