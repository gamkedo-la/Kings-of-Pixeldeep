const MOVES_PER_TURN = 3;

function armyClass(configObj) {

    /*
    this.x = 75;
    this.y = 75;
    */
    this.worldRow = 3;
    this.worldCol = 3;
    this.playerControlled = true;
    this.name = "Army 1"; //?
    this.movementRange = 5;

    this.troops = 10;
    /*
    this.troops = {
      archers: 0,
      spearmen: 0,
      horsemen: 0,
    }
    */

    if(configObj) {
        for( const [key, val] of Object.entries(configObj) ) {
            // 0 and `false` are allowed, `null` and `undefined` shouldn't be allowed
            if(val || val === 0 || val === false) { 
                this[key] = val;
            }
        }
    }

    this.picToUse = function() {
        if(this.playerControlled) {
            return playerArmyPic;
        } else {
            return enemyArmyPic;
        }
    }

    this.worldIdx = function() {
        let idx = this.worldRow * level_cols + this.worldCol;
        //console.log(this.name, idx);
        return idx;
    }
  
    this.x = function() {
        //console.log("calling this.x");
        return (this.worldCol * LEVEL_TILE_W) + (LEVEL_TILE_W / 2);
    }
    this.y = function() {
        //console.log("calling this.y");
        return (this.worldRow * LEVEL_TILE_H) + (LEVEL_TILE_H / 2);
    }


    /*
    this.create = function(troopCount, armyPos, isPlayerOwned = true) {
       this.troops = troopCount;
       this.worldIdx = armyPos;
       this.playerControlled = isPlayerOwned;
    }
    */

    this.setPosition = function(col,row) {
        this.worldCol = col;
        this.worldRow = row;
    }


    this.move = function(clickedIdx) {
        // TODO: check if location to move is within movement range
        // TODO: animations would be nice, even just programatic ones

        // TODO: diagnose this 
        let newRow = Math.floor(clickedIdx  / level_cols);
        let newCol = clickedIdx % level_cols;

        console.log(level_cols, clickedIdx, "moving "+ this.name + " to tile (" + newRow + "," + newCol +")");
        
        this.setPosition(newCol, newRow);

        if(isEnemyArmyAtPosition(newCol, newRow)) {
            setupBattleMode();
        }

        // deselect army
        selectedArmy = null;
    }

    this.onClick = function() {
        // select and move
        // EDIT: now handled in handleMainWindowClick()
    }

    this.draw = function() {
	// TODO: fix
	if(selectedArmy && (selectedArmy.name == this.name)) {
	    colorRect(
		this.x() - LEVEL_TILE_W/2,
		this.y() - LEVEL_TILE_H/2,
		LEVEL_TILE_W,
		LEVEL_TILE_H,
		'aqua', 
	    );
	}
        drawBitmapCenteredWithRotation(this.picToUse(), this.x(),this.y(), 0);
    }
}
