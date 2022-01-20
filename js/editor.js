var terrainBrushCode = 1;
var terrainBrushSize = 1;

var hoverPos = null;

var levelFile = null;

function replaceTerrain(terrainIndex) {
    if(terrainBrushSize === 1) {
	levelGrid[terrainIndex] = terrainBrushCode;

    } else if(terrainBrushSize === 3) {
	let indeciesToReplace = [];

	// push in the top row
	indeciesToReplace.push(
	    terrainIndex - (level_cols+1), 
	    terrainIndex - level_cols, 
	    terrainIndex - (level_cols-1)
	);

	// push in the middle row
	indeciesToReplace.push(
	    terrainIndex - 1, 
	    terrainIndex, 
	    terrainIndex + 1
	);
	
	// push in the bottom row
	indeciesToReplace.push(
	    terrainIndex + (level_cols+1), 
	    terrainIndex + level_cols, 
	    terrainIndex + (level_cols-1)
	);

	for(let i=0;i<indeciesToReplace.length;i++) {
	    if(indeciesToReplace[i] < levelGrid.length) { //out-of-range check
		levelGrid[indeciesToReplace[i]] = terrainBrushCode;
	    }
	}

    } else if(terrainBrushSize === 5) {
	let indeciesToReplace = [];

	// push row 1 (top row)
	let rowOffset = level_cols * 2;
	indeciesToReplace.push(
	    terrainIndex - (rowOffset+2), 
	    terrainIndex - (rowOffset+1), 
	    terrainIndex - rowOffset, 
	    terrainIndex - (rowOffset-1),
	    terrainIndex - (rowOffset-2),
	);

	// push row 2
	rowOffset = level_cols;
	indeciesToReplace.push(
	    terrainIndex - (rowOffset+2), 
	    terrainIndex - (rowOffset+1), 
	    terrainIndex - rowOffset, 
	    terrainIndex - (rowOffset-1),
	    terrainIndex - (rowOffset-2),
	);

	// push row 3 (middle row)
	rowOffset = 0;
	indeciesToReplace.push(
	    terrainIndex + 2, 
	    terrainIndex + 1, 
	    terrainIndex, 
	    terrainIndex - 1,
	    terrainIndex - 2,
	);

	// push row 4
	rowOffset = level_cols;
	indeciesToReplace.push(
	    terrainIndex + (rowOffset-2), 
	    terrainIndex + (rowOffset-1), 
	    terrainIndex + rowOffset, 
	    terrainIndex + (rowOffset+1),
	    terrainIndex + (rowOffset+2),
	);

	// push row 5 (bottom row)
	rowOffset = level_cols * 2;
	indeciesToReplace.push(
	    terrainIndex + (rowOffset-2), 
	    terrainIndex + (rowOffset-1), 
	    terrainIndex + rowOffset, 
	    terrainIndex + (rowOffset+1),
	    terrainIndex + (rowOffset+2),
	);
	
	for(let i=0;i<indeciesToReplace.length;i++) {
	    if(indeciesToReplace[i] < levelGrid.length) { //out-of-range check
		levelGrid[indeciesToReplace[i]] = terrainBrushCode;
	    }
	}
    } else {
	console.log("ERROR: invalid terrainBrushSize: ", terrainBrushSize);
    }
}

function setTerrainBrushCode(newVal) {
    terrainBrushCode = newVal;
}

// should this be moved to a UI file?
function drawHoverBox() {
    if(hoverPos) {
	var hoverTileOverCol = Math.floor( (hoverPos.levelX) / LEVEL_TILE_W);
	var hoverTileOverRow = Math.floor( (hoverPos.levelY) / LEVEL_TILE_H);    

	var hoverTileX = hoverTileOverCol * LEVEL_TILE_W;
	var hoverTileY = hoverTileOverRow * LEVEL_TILE_H;

	var hoverBoxStartOffset = 0;
	if(terrainBrushSize === 3) {
	    hoverBoxStartOffset = 1 * LEVEL_TILE_W;
	}
	if(terrainBrushSize === 5) {
	    hoverBoxStartOffset = 2 * LEVEL_TILE_W;
	}

	var hoverBoxTopX = (hoverTileX - hoverBoxStartOffset) - camPanX;
	var hoverBoxTopY = (hoverTileY - hoverBoxStartOffset) - camPanY;    
	var hoverBoxW = LEVEL_TILE_W * terrainBrushSize;
	var hoverBoxH = LEVEL_TILE_H * terrainBrushSize;

	outlineRect(hoverBoxTopX,hoverBoxTopY, hoverBoxW,hoverBoxH, "purple");
	colorText(
	    "("+hoverBoxTopX+","+hoverBoxTopY+")",
	    hoverBoxTopX,hoverBoxTopY-12, "purple"
	);
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
