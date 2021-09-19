var terrainBrushCode = 1;
var terrainBrushSize = 1;

var levelFile = null;

function replaceTerrain(terrainIndex, terrainCode) {
    levelGrid[terrainIndex] = terrainCode;
}

function setTerrainBrushCode(newVal) {
    terrainBrushCode = newVal;
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
