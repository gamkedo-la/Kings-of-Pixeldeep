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
    this.pathAnimPercent = 1; // 0..1 so we can travel along the path
    this.pathAnimSpeed = 0.02; // percent per frame

    this.troops = {
        peasants: 0,
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

        // if we have an existing path, travel it over time
        // note that this does not change what tile we are on:
        // for game logic we are already at the destination tile
        // this is the reported sprite location which animates
        if (this.pathAnimPercent < 1) {
            if (this.animatingPath && this.animatingPath.length>1) {
                let pathIndexFloat = (this.animatingPath.length-1)*this.pathAnimPercent;
                let pathIndex = Math.floor(pathIndexFloat);
                let x1 = this.animatingPath[pathIndex][0];
                let x2 = this.animatingPath[pathIndex+1][0];
                let remainder = pathIndexFloat - pathIndex;
                let xpos = (x1+((x2-x1)*remainder))*LEVEL_TILE_H;
                xpos += LEVEL_TILE_W/2;
                //console.log("animated xpos="+xpos);
                return xpos;
            }
        }

        // default: the current tile destination
        return (this.worldCol * LEVEL_TILE_W) + (LEVEL_TILE_W / 2);
    }
    this.y = function() {
        //console.log("calling this.y");

        // if we have an existing path, travel it over time
        // note that this does not change what tile we are on:
        // for game logic we are already at the destination tile
        // this is the reported sprite location which animates
        if (this.pathAnimPercent < 1) {
            if (this.animatingPath && this.animatingPath.length>1) {
                let pathIndexFloat = (this.animatingPath.length-1)*this.pathAnimPercent;
                let pathIndex = Math.floor(pathIndexFloat);
                let y1 = this.animatingPath[pathIndex][1];
                let y2 = this.animatingPath[pathIndex+1][1];
                let remainder = pathIndexFloat - pathIndex;
                let ypos = (y1+((y2-y1)*remainder))*LEVEL_TILE_H;
                ypos += LEVEL_TILE_H/2;
                //console.log("animated ypos="+ypos);
                return ypos;
            }
        }

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
        this.pathAnimPercent = 0; // start animating movement along path
        console.log("setting army position to tile "+col+","+row+" and starting path movement anim");
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
        if(canMoveToTarget && !pauseMode) {
            console.log(level_cols, clickedIdx, "moving "+ this.name + " to tile (" + newRow + "," + newCol +")");

            this.setPosition(newCol, newRow);

            this.currentMovementPoints -= this.currentPath.length;
            this.animatingPath = this.currentPath.slice(); // duplicate
            this.currentPath = null;

            if(isEnemyArmyAtPosition(newCol, newRow)) {
                setupBattleMode();
            }

            // deselect army
            selectedWorldEntity = null;
        }

    } // end this.move()

    this.AIMove = function() {
        if(this.playerControlled) {
            return; // enemy AI can't move player armies
        }

        console.log('Calling AIMove() on enemy army', this);
    }

    this.draw = function() {

        // keeps animating until this goes over 1
        if (this.pathAnimPercent < 1) {
            this.pathAnimPercent += this.pathAnimSpeed;
            //console.log("this.pathAnimPercent="+this.pathAnimPercent.toFixed(2));
        }

        if(selectedWorldEntity && (selectedWorldEntity.name == this.name) &&
            selectedWorldEntity instanceof armyClass) {
            colorRect(
            this.x() - LEVEL_TILE_W/2,
            this.y() - LEVEL_TILE_H/2,
            LEVEL_TILE_W,
            LEVEL_TILE_H,
            'aqua', 
            );
        }

        if (this.currentPath && this.currentPath.length) {
            for (let n=0; n<this.currentPath.length; n++) {
                let x = this.currentPath[n][0]*LEVEL_TILE_W+2;
                let y = this.currentPath[n][1]*LEVEL_TILE_H+2;
                //console.log("drawing a pathfinding tile at "+x+","+y);
                //outlineRect(x,y,LEVEL_TILE_W-4,LEVEL_TILE_H-4,"rgba(20,255,20,0.2)");

                let indicatorColor = 'white';

                // not sure why, but subtracting 1 here stops the tile
                // after the army's last movement point being the wrong color
                if(n > this.currentMovementPoints - 1) { 
                    indicatorColor = 'black';
                }
                // Temp army path hover indicators
                if(n === this.currentPath.length - 1) {
                    let boxShrinkPx = 10;
                    colorRect(x + boxShrinkPx, y + boxShrinkPx,
                        LEVEL_TILE_W - boxShrinkPx, LEVEL_TILE_H - boxShrinkPx,
                        indicatorColor);
                } else {
                    colorCircle(x + (LEVEL_TILE_W / 2),
                        y + (LEVEL_TILE_H / 2),
                        8, indicatorColor);
                } // end else

            } // end for
        } // end if


        drawBitmapCenteredWithRotation(this.picToUse(), this.x(),this.y(), 0);

    } // end this.draw()

} // end army class
