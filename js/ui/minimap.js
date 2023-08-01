const MINI_MAP_START_X = 600;
const MINI_MAP_START_Y = 0;
//const MINI_MAP_PIXEL_MARGIN = 1;

const MINI_MAP_WIDTH = 200;
const MINI_MAP_HEIGHT = 200;


const miniMapColors = [
    '#ff00ff',
    '#939393', // WORLD_MOUNTAINS
    '#006f00', // WORLD_FOREST
    '#1fff00', // WORLD_GRASS
    '#ffff00', // WORLD_FARM
    '#0fffff', // WORLD_WATER

    '#c3c3c3', // WORLD_SHALLOWS
    '#ff00ff',
    '#ff00ff',
    '#ff00ff',

    '#ff00ff',
    '#009923', // BATTLE_FIELD
    '#006f00', // BATTLE_TREES
    '#a5a5a5', // BATTLE_ROCKS
]


function drawMiniMap() {
    //console.log("level_cols", level_cols);

    //var miniMapTileSize = Math.floor( SIDEBAR_WIDTH / level_rows );

    // clear minimap backdrop
    colorRect(MINI_MAP_START_X,MINI_MAP_START_Y, 
        MINI_MAP_WIDTH,MINI_MAP_HEIGHT,
        'black');

    var miniMapXScaleFactor = (level_cols * LEVEL_TILE_W) / MINI_MAP_WIDTH;
    var miniMapYScaleFactor = (level_rows * LEVEL_TILE_H) / MINI_MAP_HEIGHT;

    var miniMapTileW = LEVEL_TILE_W / miniMapXScaleFactor;
    var miniMapTileH = LEVEL_TILE_H / miniMapYScaleFactor;

    var miniMapIndex = 0;
    var miniMapX = MINI_MAP_START_X;
    var miniMapY = MINI_MAP_START_Y;

    for(var miniMapRow=0;miniMapRow<level_rows;miniMapRow++) {
	for(var miniMapCol=0;miniMapCol<level_cols;miniMapCol++) {
	    var miniMapTileKind = levelGrid[miniMapIndex];
	    var miniMapColor = miniMapColors[miniMapTileKind];
	    colorRect( miniMapX,miniMapY, miniMapTileW,miniMapTileH, miniMapColor);
		//miniMapTileSize,miniMapTileSize, miniMapColor);
		//LEVEL_TILE_W / miniMapXScaleFactor,
		//LEVEL_TILE_H / miniMapYScaleFactor,
		//miniMapColor);

	    miniMapX += miniMapTileW; //miniMapTileSize;
	    miniMapIndex++;
	}
	miniMapY += miniMapTileH; //miniMapTileSize;
	miniMapX = MINI_MAP_START_X;
    }

    // draw camera box
    var miniMapCamX = camPanX / miniMapXScaleFactor + MINI_MAP_START_X;
    var miniMapCamY = camPanY / miniMapYScaleFactor + MINI_MAP_START_Y;
    var rowsOnScreen = colsOnScreen = 15;

    var miniMapBoxEndX = miniMapCamX + (rowsOnScreen * miniMapTileW);
    var miniMapBoxEndY = miniMapCamY + (colsOnScreen * miniMapTileH);

    //console.log("miniMap X,Y", miniMapCamX, miniMapCamY);
//    console.log("mm bottom corner XY",
//	miniMapCamX + rowsOnScreen * miniMapTileSize, 
//	miniMapCamY + colsOnScreen * miniMapTileSize, );

    coloredOutlineRectCornerToCorner(
	miniMapCamX, miniMapCamY, miniMapBoxEndX, miniMapBoxEndY, "white"
    );
    
    if(gameOptions.showDebug) {
        colorText(miniMapCamX +","+ miniMapCamY, miniMapCamX, miniMapCamY, "yellow");
        colorText(miniMapBoxEndX +","+ miniMapBoxEndY, miniMapBoxEndX, miniMapBoxEndY, "yellow");
    }
    /*
    colorText(miniMapTileSize, miniMapCamX + 2, miniMapCamY + 50, "red");
    colorText(miniMapTileSize * 15, miniMapCamX + 50, miniMapCamY + 50, "lightblue");


    colorText("cols,rows: "+level_cols+","+level_rows, MINI_MAP_START_X, 
	MINI_MAP_START_Y + 300, "white");
	*/

    if(!battleMode) {
        // TODO: draw cities & armies
    }

    if(battleMode) {
        for(const unit of allUnits) {
            let unitMiniMapX = (unit.x / miniMapXScaleFactor) + MINI_MAP_START_X;
            let unitMiniMapY = (unit.y / miniMapYScaleFactor) + MINI_MAP_START_Y;
            let unitMiniMapBoxSize = 3;

            let unitColor = "yellow";
            if(!unit.playerControlled) {
                unitColor = "red";
            }

            colorRect(unitMiniMapX, unitMiniMapY,
                unitMiniMapBoxSize, unitMiniMapBoxSize,
                unitColor);
        } // end for loop

    } // end if battleMode

} // end function

function handleMiniMapClick(mousePos) {
    var miniMapXScaleFactor = (level_cols * LEVEL_TILE_W) / MINI_MAP_WIDTH;
    var miniMapYScaleFactor = (level_rows * LEVEL_TILE_H) / MINI_MAP_HEIGHT;

    var miniMapTileW = LEVEL_TILE_W / miniMapXScaleFactor;
    var miniMapTileH = LEVEL_TILE_H / miniMapYScaleFactor;

    var miniMapClickedX = mousePos.x - MINI_MAP_START_X; 
    var miniMapClickedY = mousePos.y - MINI_MAP_START_Y; 

    var rowsOnScreen = colsOnScreen = 15;

    var miniMapCamBoxW = colsOnScreen * miniMapTileW;
    var miniMapCamBoxH = rowsOnScreen * miniMapTileH;

    //console.log("miniMapCamBoxW", miniMapCamBoxW / 2, "miniMapCamBoxH", miniMapCamBoxH / 2);

    camPanX = Math.round((miniMapClickedX - (miniMapCamBoxW / 2) ) * miniMapXScaleFactor);
    camPanY = Math.round((miniMapClickedY - (miniMapCamBoxH / 2) ) * miniMapYScaleFactor);
    //console.log("set camPan", camPanX, camPanY)

}

