function armyClass(configObj) {

    /*
    this.x = 75;
    this.y = 75;
    */
    this.worldRow = 3;
    this.worldCol = 3;
    this.goToX = null;
    this.goToY = null;
    this.playerControlled = true;
    this.name = "Army 1"; // may pick randomly from a list or not end up getting used, we'll see
    this.maxMovementPoints = 10;
    this.currentMovementPoints = 10;
    this.currentPath = null; // pathfinding data in the form [[x,y],[x,y],etc]

    this.troops = {
      archers: 0,
      spearmen: 0,
      horsemen: 0,
    }

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

    // the results of pathfinding are sent here
    this.setMovementPath = function(pathData) {
        if (!pathData || !pathData.length) {
            console.log(this.name+" movement path reset. staying put.");
        } else {
            console.log(this.name+" starting a movement path with "+pathData.length+" steps!");
        }
        this.currentPath = pathData;
    }

    this.move = function(clickedIdx) {
        let newRow = Math.floor(clickedIdx  / level_cols);
        let newCol = clickedIdx % level_cols;
        let canMoveToTarget = true;

        // check that there _is_ a path
        if(!this.currentPath || !this.currentPath.length) {
            console.log("no path, cannot move");
            canMoveToTarget = false;
            return;
        }

        // check path dist vs current move pts
        if(this.currentMovementPoints < 1) {
            console.log("no movement points left, cannot move");
            canMoveToTarget = false;
            return;
        }

        if(this.currentMovementPoints < this.currentPath.length) {
            console.log("Cannot move to target; current MP:", 
                this.currentMovementPoints, "path length:", 
                this.currentPath.length);
            canMoveToTarget = false;
            return;
        }
        
        // if can, move
        if(canMoveToTarget) {
            console.log(level_cols, clickedIdx, "moving "+ this.name + " to tile (" + newRow + "," + newCol +")");

            // TODO: tween based off path
            this.setPosition(newCol, newRow);

            this.currentMovementPoints -= this.currentPath.length;
            this.currentPath = null;

            if(isEnemyArmyAtPosition(newCol, newRow)) {
                setupBattleMode();
            }

            // deselect army
            selectedArmy = null;
        }

    } // end this.move()

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

        //if (TEST_PATHFINDING) {
            if (this.currentPath && this.currentPath.length) {
                for (let n=0; n<this.currentPath.length; n++) {
                    let x = this.currentPath[n][0]*LEVEL_TILE_W+2;
                    let y = this.currentPath[n][1]*LEVEL_TILE_H+2;
                    //console.log("drawing a pathfinding tile at "+x+","+y);
                    //outlineRect(x,y,LEVEL_TILE_W-4,LEVEL_TILE_H-4,"rgba(20,255,20,0.2)");
                    // Temp army path hover indicators
                    // TODO: indicate army remaining MP by coloring circles & end icon
                    if(n === this.currentPath.length - 1) {
                        let boxShrinkPx = 10;
                        colorRect(x + boxShrinkPx, y + boxShrinkPx,
                            LEVEL_TILE_W - boxShrinkPx, LEVEL_TILE_H - boxShrinkPx,
                            'white');
                    } else {
                        colorCircle(x + (LEVEL_TILE_W / 2),
                            y + (LEVEL_TILE_H / 2),
                            8, 'white');
                    } // end else


                } // end for
            } // end if

        //} // end if(TEST_PATHFINDING)

        drawBitmapCenteredWithRotation(this.picToUse(), this.x(),this.y(), 0);

    } // end this.draw()

} // end army class
