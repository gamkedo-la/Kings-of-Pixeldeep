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
    this.name = "Army 1"; 
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
        let newRow, newCol;

        if(clickedIdx) {
            // player clicked to start the move, use click location as target
            newRow = Math.floor(clickedIdx  / level_cols);
            newCol = clickedIdx % level_cols;
        } else {
            // assuming we've set the path manually from this.AIMove()
            // rather than calling this from a player mouse click
            newRow = this.currentPath[this.currentPath.length - 1][1]; // row = Y coord
            newCol = this.currentPath[this.currentPath.length - 1][0]; // col = X coord
        }

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

            console.log('move complete, checking for armies and cities at destination', newCol, newRow);

            // check for other armies & start battle mode if necessary
            if(this.playerControlled && isEnemyArmyAtPosition(newCol, newRow)) {
                console.log('player army checking for enemy army at', newCol, newRow);
                setupBattleMode(newCol, newRow);
            }
            if(!this.playerControlled && isPlayerArmyAtPosition(newCol, newRow)) {
                console.log('enemy army checking for player army at', newCol, newRow);
                setupBattleMode(newCol, newRow);
            }

            // check for a city at new army's location
            for(const city of allCities) {
                //console.log('checking city', city);
                if(city.worldCol === newCol && city.worldRow === newRow) {
                    tryToCapture(city, this);
                }
            }

            // deselect army
            selectedWorldEntity = null;

        }

    } // end this.move()

    this.AIMove = function(targetCoords=null) {
        if(this.playerControlled) {
            return; // enemy AI can't move player armies
        }

        console.log('Calling AIMove() on enemy army', this);

        console.log('worldCol', this.worldCol, 'worldRow', this.worldRow)
        let targetX = 0;
        let targetY = 0;
        let tileIndex = 0;
        let MAX_TRIES = 50;
        let chosenTargetTries = 10;
        let tries = 0;
        let canMoveToTarget = false;

        // pick target
        let possibleTargets = playerArmies.concat(playerCities);
        let pathsInRange = [];
        let chosenTargetPath = null;

        for(const target of possibleTargets) {
            let pathToTarget = levelGridPathfind(this.worldCol, this.worldRow, 
                target.worldCol, target.worldRow);

            if(pathToTarget.length <= this.currentMovementPoints) {
                pathsInRange.push(pathToTarget);
            }
        }

        if(pathsInRange.length > 0) {
            chosenTargetPath = pickRandomFromArray(pathsInRange);
        }

        // keep trying until we find a "possible move"
        while (!canMoveToTarget && tries<MAX_TRIES) { // avoid an infinite loop if we always fail

            tries++;
            
            /*
            // move to somewhere within ONE TILE of me (for now!!)
            targetX = this.worldCol + Math.round(Math.random()*2-1);
            targetY = this.worldRow + Math.round(Math.random()*2-1);
            // choose from ENTIRE MAP
            //targetX = Math.floor(Math.random()*level_cols);
            //targetY = Math.floor(Math.random()*level_rows);
            */

            if(targetCoords) {
                console.log('debug coordinates were provided', targetCoords);
                targetX = targetCoords.x;
                targetY = targetCoords.y;
            }

            // no target coords, checking for a chosen target
            if(chosenTargetPath && tries < chosenTargetTries) {
                console.log('moving along chosen target path', chosenTargetPath);

                // we already have a path, let's just use it
                let pathEnd = chosenTargetPath[chosenTargetPath.length - 1];
                tileIndex = tileCoordToIndex(pathEnd.x,pathEnd.y);

                this.setMovementPath(chosenTargetPath);
                this.move();
                break;

            } else {
                console.log('moving randomly in the direction of a possible target');
                // choose a random possible target and move vaguely in it's direction
                let randomTarget = pickRandomFromArray(possibleTargets);
                console.log('random target', randomTarget);

                if(randomTarget.worldCol > this.worldCol) {
                    // pick random target worldCol in positive X direction
                    targetX = Math.round(Math.random() * this.currentMovementPoints) + this.worldCol;
                } else {
                    // pick random target worldCol in negative X direction
                    targetX = (Math.round(Math.random() * this.currentMovementPoints) * -1) +
                        this.worldRow;
                }

                if(randomTarget.worldRow > this.worldRow) {
                    // pick random target worldRow in positive Y direction
                    targetY = Math.round(Math.random() * this.currentMovementPoints) + this.worldRow;
                } else {
                    // pick random target worldRow in negative Y direction
                    targetY = (Math.round(Math.random() * this.currentMovementPoints) * -1) + 
                        this.worldRow;
                }
            }
            
            // last possible fallback, just move randomly
            if(!targetX && !targetY) {
                console.log('all else has failed, we are just moving randomly at this point');
                targetX = this.worldCol + Math.round(Math.random()*this.currentMovementPoints) - 1;
                targetY = this.worldRow + Math.round(Math.random()*this.currentMovementPoints) - 1;
            }

            // coordinates picked, let's get moving
            tileIndex = tileCoordToIndex(targetX,targetY);

            console.log("AIMove: trying "+targetX+","+targetY+" = index "+tileIndex);
            
            // checking if can move to target
            if(targetX != this.x && targetY != this.y) {
                canMoveToTarget = true;
            } else {
                canMoveToTarget = false;
            }

            // TODO: we could choose several possible targets randomly from the array of enemy armies! 
            // then measure the pathfinding cost of each and reject impossible ones

            if (!canMoveToTarget) {
                console.log("AIMove: unable to get to "+targetX+","+targetY+" - trying another...");
            } else {
                let path = levelGridPathfind(this.worldCol,this.worldRow,targetX,targetY);
                console.log('AI found path', path);

                this.setMovementPath(path);
                this.move(tileIndex);
                break;
            }
        }

        console.log("AIMove: chosen target is: "+targetX+","+targetY);

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
