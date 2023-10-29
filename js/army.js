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
    this.eventTarget = new EventTarget();
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
        let beginBattleAfterAnimation = false;

        if(clickedIdx) {
            // player clicked to start the move, use click location as target
            newRow = Math.floor(clickedIdx  / level_cols);
            newCol = clickedIdx % level_cols;
            if(isNaN(newRow) || isNaN(newCol)) {
                console.error('ERROR: NaN found on clicked index');
            }
        } else {
            // assuming we've set the path manually from this.AIMove()
            if(!this.currentPath || this.currentPath.length < 1) {
                console.log('ERROR: army.move() called without clickedIdx or valid currentPath', clickedIdx, this.currentPath);
            } else {
                newRow = this.currentPath[this.currentPath.length - 1][1]; // row = Y coord
                newCol = this.currentPath[this.currentPath.length - 1][0]; // col = X coord
            }
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
            if (armyMarchingSound) {
                armyMarchingSound.play();
            }

            this.setPosition(newCol, newRow);

            this.currentMovementPoints -= this.currentPath.length;
            this.animatingPath = this.currentPath.slice(); // duplicate
            this.currentPath = null;

            console.log('move complete, checking for armies and cities at destination', newCol, newRow);

            // check for other armies & start battle mode if necessary
            if(!beginBattleAfterAnimation && this.playerControlled && isEnemyArmyAtPosition(newCol, newRow)) {
                console.log('player army checking for enemy army at', newCol, newRow);

                beginBattleAfterAnimation = true;
            }

            if(!beginBattleAfterAnimation && !this.playerControlled && isPlayerArmyAtPosition(newCol, newRow)) {
                console.log('enemy army checking for player army at', newCol, newRow);

                beginBattleAfterAnimation = true;
            }

            // check for a city at new army's location
            for(const city of allCities) {
                //console.log('checking city', city);
                if(city.worldCol === newCol && city.worldRow === newRow) {
                    tryToCapture(city, this);
                }
            }

            // create a listener to begin a battle when the animation ends
            this.eventTarget.addEventListener('animationEnded', function(newCol, newRow) {
                if (armyMarchingSound && !armyMarchingSound.paused()) { 
                    // stop marching sound
                    armyMarchingSound.pause();
                }
                if (beginBattleAfterAnimation) {
                    setupBattleMode(newCol, newRow);
                }

                // clear selection & sidebar info after movement is complete
                this.selectedWorldEntity = null;
                currentSidebarLabels = [];
                currentSidebarButtons = WORLD_SIDEBAR_BUTTONS;

            }, { once: true });

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
        let chosenTargetTries = 20;
        let tries = 0;
        let canMoveToTarget = false;

        // keep trying until we find a "possible move"
        while (!canMoveToTarget && tries<MAX_TRIES) { // avoid an infinite loop if we always fail
            tries++;
            console.log('tries:', tries);

            // select a path

            // debug target coords are passed in the arg

            // try for possible targets
            let possibleTargets = playerArmies.concat(playerCities);
            let pathsInRange = [];
            let chosenTargetPath = null;

            for(const target of possibleTargets) {
                let pathToTarget = levelGridPathfind(this.worldCol, this.worldRow, 
                    target.worldCol, target.worldRow);

                if(pathToTarget.length <= this.currentMovementPoints && pathToTarget.length > 0) {
                    pathsInRange.push(pathToTarget);
                }
            }

            if(pathsInRange.length > 0) {
                chosenTargetPath = pickRandomFromArray(pathsInRange);
            }
            
            // last possible fallback, pick a random targetX & targetY in range
            randomTargetX = this.worldCol + Math.round(Math.random()*this.currentMovementPoints) - 1;
            randomTargetY = this.worldRow + Math.round(Math.random()*this.currentMovementPoints) - 1;


            // ok, we have all our path options, let's pick one & move
            let chosenPathThisLoop = null;

            if(targetCoords) {
                console.log('debug coordinates were provided', targetCoords);
                let debugPath  = levelGridPathfind(this.worldCol, this.worldRow, 
                    targetCoords.x, targetCoords.y);

                if(debugPath.length <= this.currentMovementPoints || debugPath.length < 1) {
                    chosenPathThisLoop = debugPath;
                } else {
                    console.log('debug path was too long or short', debugPath);
                }
            }

            // no target coords, checking for a chosen target
            if(!chosenPathThisLoop && chosenTargetPath) {
                console.log('moving along path to chosen target', chosenTargetPath);

                if(chosenTargetPath.length <= this.currentMovementPoints || chosenTargetPath.length < 1) {
                    chosenPathThisLoop = chosenTargetPath;
                } else {
                    console.log('chosen target too long or short', chosenTargetPath);
                }

            } 

            // no valid chosen target, falling back to random coords
            if(!chosenPathThisLoop) {
                console.log('moving on to random location', randomTargetX, randomTargetY);
                let randomPath = levelGridPathfind(this.worldCol,this.worldRow,
                    randomTargetX,randomTargetY);
                if(randomPath.length <= this.currentMovementPoints && randomPath.length >= 1) {
                    chosenPathThisLoop = randomPath;
                } else {
                    console.log('random path too long or short', randomPath);
                }
            }

            // ok, we should have picked a path by now. If not, we'll send the loop around again
            if(chosenPathThisLoop) {
                this.setMovementPath(chosenPathThisLoop);
                this.move();
                canMoveToTarget = true;
                break;
            } else {
                canMoveToTarget = false;
            }

        }

    }

    this.draw = function() {
        let isAnimating = this.pathAnimPercent < 1;

        // keeps animating until this goes over 1
        if (this.pathAnimPercent < 1) {
            this.pathAnimPercent += this.pathAnimSpeed;
            //console.log("this.pathAnimPercent="+this.pathAnimPercent.toFixed(2));
        } 

        if(selectedWorldEntity && (selectedWorldEntity.name == this.name) &&
            selectedWorldEntity instanceof armyClass) {
            
                // a blue square
                //colorRect(
                //this.x() - LEVEL_TILE_W/2,
                //this.y() - LEVEL_TILE_H/2,
                //LEVEL_TILE_W,
                //LEVEL_TILE_H,
                //'aqua');

                canvasContext.globalAlpha = 0.5;
                canvasContext.drawImage(armySelection,this.x()-LEVEL_TILE_W/2-12,this.y()-LEVEL_TILE_H/2-12);
                canvasContext.globalAlpha = 1;



        }

        if (this.currentPath && this.currentPath.length) {
            for (let n=0; n<this.currentPath.length; n++) {
                let x = this.currentPath[n][0]*LEVEL_TILE_W+2;
                let y = this.currentPath[n][1]*LEVEL_TILE_H+2;
                //console.log("drawing a pathfinding tile at "+x+","+y);
                //outlineRect(x,y,LEVEL_TILE_W-4,LEVEL_TILE_H-4,"rgba(20,255,20,0.2)");

                let indicatorColor = 'rgba(255,255,255,0.25)'; //'white';

                // not sure why, but subtracting 1 here stops the tile
                // after the army's last movement point being the wrong color
                if(n > this.currentMovementPoints - 1) { 
                    indicatorColor = 'black';
                }
                // Temp armby path hover indicators
                if(n === this.currentPath.length - 1) {
                    
                    // a box
                    //let boxShrinkPx = 10;
                    //colorRect(x + boxShrinkPx, y + boxShrinkPx,
                    //    LEVEL_TILE_W - boxShrinkPx, LEVEL_TILE_H - boxShrinkPx,
                    //    indicatorColor);

                    canvasContext.globalAlpha = 0.25;
                    canvasContext.drawImage(destinationMarker, x, y);
                    canvasContext.globalAlpha = 1;

                    if (n > this.currentMovementPoints - 1) { // path too long?
                        colorText("Not enough move points.",x,y-10,"rgba(255,255,255,0.5)");
                    }



                } else {
                    
                    // dots showing the path
                    colorCircle(x + (LEVEL_TILE_W / 2),
                        y + (LEVEL_TILE_H / 2),
                        6, indicatorColor);

                } // end else

            } // end for
        } // end if


        // draw actual army sprite
        drawBitmapCenteredWithRotation(this.picToUse(), this.x(),this.y(), 0);

        if(this.playerControlled) {
        // draw movement-points-left indicator
        let MPIndicatorXOffset = 20;
        let MPIndicatorYOffset = -18;
        let MPIndicatorColor = (this.currentMovementPoints > 0 ? "limegreen" : "darkred" );
        let MPIndicatorRadius = (this.currentMovementPoints > 0 ? 3 : 2 );

        // draw circle behind for white outline
        colorCircle(this.x() + MPIndicatorXOffset, this.y() + MPIndicatorYOffset,
            MPIndicatorRadius + 1, 'lightgray');

        // draw indicator itself 
        colorCircle(this.x() + MPIndicatorXOffset, this.y() + MPIndicatorYOffset,
            MPIndicatorRadius, MPIndicatorColor);
        }

        if (isAnimating && this.pathAnimPercent >= 1) {
            isAnimating = false;
            let animationEndedEvent = new CustomEvent("animationEnded")
            this.eventTarget.dispatchEvent(animationEndedEvent);
        }
    } // end this.draw()

    this.troopCount = function() {
        let unitsCounted = 0;
        Object.entries(this.troops).map(troopTypeCountPair => {
            const value = troopTypeCountPair[1];
            unitsCounted += value;
            // do whatever you want with those values.
         });

         return unitsCounted;
    }
} // end army class
