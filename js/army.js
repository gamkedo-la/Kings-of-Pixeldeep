const MOVES_PER_TURN = 3;

function armyClass() {

    /*
    this.x = 75;
    this.y = 75;
    */
    this.worldRow = 3;
    this.worldCol = 3;
    this.picToUse = armyPic;
    this.name = "Army 1"; //?

    this.troops = 10;
    /*
    this.troops = {
      archers: 0,
      spearmen: 0,
      horsemen: 0,
    }
    */
  
    this.x = function() {
	//console.log("calling this.x");
	return (this.worldCol * LEVEL_TILE_W) + (LEVEL_TILE_W / 2);
    }
    this.y = function() {
	//console.log("calling this.y");
	return (this.worldRow * LEVEL_TILE_H) + (LEVEL_TILE_H / 2);
    }


    this.create = function(troopCount, armyPos) {
       this.troops = troopCount;
       this.worldIdx = armyPos;
    }

    this.setPosition = function(col,row) {
	this.worldCol = col;
	this.worldRow = row;
    }


    this.move = function() {
	//
    }

    this.onClick = function() {
	startBattle();
	// select and move
    }

    this.draw = function() {
	// TODO: fix
        drawBitmapCenteredWithRotation(this.picToUse, this.x(),this.y(), 0);
    }
}
