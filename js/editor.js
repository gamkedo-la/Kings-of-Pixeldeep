var terrainBrushCode = 1;
var terrainBrushSize = 1;

var hoverPos = null;

var levelFile = null;

function replaceTerrain(terrainIndex, terrainCode) {
    levelGrid[terrainIndex] = terrainCode;
}

function setTerrainBrushCode(newVal) {
    terrainBrushCode = newVal;
}

function drawHoverBox() {
    if(hoverPos) {
	var hoverTileOverCol = Math.floor( (hoverPos.x) / LEVEL_TILE_W);
	var hoverTileOverRow = Math.floor( (hoverPos.y) / LEVEL_TILE_H);    

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
}

function exportLevel() {
    let levelData = new Blob([text], {type: 'text/json'});

    if (levelFile !== null) {
      window.URL.revokeObjectURL(levelFile);
    }
    
    levelFile = window.URL.createObjectURL(levelData);

    return levelFile;
    
    // TODO: show link to download level file
    // see https://stackoverflow.com/a/21016088
}
