const UNIT_PLACEHOLDER_RADIUS = 10;
const UNIT_SELECT_DIM_HALF = UNIT_PLACEHOLDER_RADIUS + 3;
const UNIT_PIXELS_MOVE_RATE = 1.5;
const UNIT_RANKS_SPACING = UNIT_PLACEHOLDER_RADIUS *3.5;
const UNIT_COLLISION_RADIUS = 20;
const UNIT_ATTACK_RANGE = 55;
const UNIT_AI_ATTACK_INITIATE = UNIT_ATTACK_RANGE + 10;
const UNIT_PLAYABLE_AREA_MARGIN = 20;
const UNIT_NEARBY_UNIT_SEEK_RANGE = 
  Math.max(level_width, level_height) - UNIT_PLAYABLE_AREA_MARGIN;
const UNIT_PLAYER_ATTACK_INITIATE = UNIT_AI_ATTACK_INITIATE; 
const BATTLE_WAIT_LOOPS = 20;
const UNIT_GOTO_QUEUE_LIMIT = 2;
const UNIT_COURAGE_PCT_MAX = 0.05;
const UNIT_COURAGE_PCT_MIN = 0.01;
const UNIT_RANDOM_LAG_CHECK = 0.02;

function unitClass() {
  this.resetAndSetPlayerTeam = function(playerTeam) {
    this.receiveId();
    this.playerControlled = playerTeam;

    // get units in formation from the start
    this.x = Math.random()*canvas.width/4;
    this.x += 50;
    this.y = Math.random()*canvas.height/4;
    this.y += 50;

    this.moveX = 0;
    this.moveY = 0;

    // queue for x, y goto data when an extended path is necessary
    this.gotoQueue = [];
    this.gotoQueueLimit = UNIT_GOTO_QUEUE_LIMIT;

    this.moveDirection = "S";
    this.clearTarget();

    this.baseCourage = 
      Math.max(UNIT_COURAGE_PCT_MAX * Math.random(), UNIT_COURAGE_PCT_MIN);

    // Flip all non-player units to opposite corner
    if(this.playerControlled === false) {
      var unitsAlongside = Math.floor(Math.sqrt(enemyUnits.length+3));
      this.x = level_width - this.x;
      this.y = level_height - this.y;
      this.unitColor = 'red';
      this.moveDirection = "N";
    } else {
      this.unitColor = 'white';
    }

    this.gotoX = this.x;
    this.gotoY = this.y;
    this.isDead = false;
    this.move();
  }

  // create an unique count
  if (typeof unitClass.idCount === 'undefined') {
    unitClass.idCount = 0;
  }

  // give unit a unique based on the count
  unitClass.giveId = function(unit) {
    unit.id = (unitClass.idCount++).toString(16).toUpperCase();
  }
  // request a new id
  this.receiveId = function() {
    unitClass.giveId(this);
  }

  this.move = function() {
    var allyUnits = null;
    var opponentUnits = null;
    var directionModifier = 0;
    if(this.playerControlled === false) {
      allyUnits = enemyUnits;
      opponentUnits = playerUnits;
      directionModifier = -1;
    } else {
      allyUnits = playerUnits;
      opponentUnits = enemyUnits;
      directionModifier = 1;
    }
    var allyRatio = 0;
    if (allUnits.length > 0) {
      allyRatio = allyUnits.length / allUnits.length;
    }
    var modifiedAllyRatio = allyRatio * (Math.random() % 0.25);
    // apply allyRatio to courage
    var modifiedCourage = this.baseCourage + modifiedAllyRatio;

    if(this.myTarget != null) {
      if(this.distFrom(this.myTarget.x, this.myTarget.y) <= UNIT_ATTACK_RANGE) {
        if(this.myTarget.isDead === false && 
          this.myTarget.playerControlled != this.playerControlled
        ) {
          this.myTarget.dies();
          soonCheckUnitsToClear();
        }
        this.clearTarget();
      } else {
        this.gotoPathAndWait(this.myTarget.x, this.myTarget.y, 1, "SEEK_TARGET");
      }
    } else if(this.playerControlled === false) {
      // AI player unit seeking
      if(Math.random() < UNIT_RANDOM_LAG_CHECK) {
        // determine whether units are individually courageous or not
        var unitSeekRange = UNIT_AI_ATTACK_INITIATE;
        // courage check depending on how many opponents
        if(Math.random() < modifiedCourage && this.isStopped()) {
          // widen unit seeking range
          unitSeekRange = UNIT_NEARBY_UNIT_SEEK_RANGE;
        }
        var nearestOpponentFound = 
          findClosestUnitInRange(this.x, this.y, unitSeekRange, opponentUnits);

        if(nearestOpponentFound != null) {
          this.setTarget(nearestOpponentFound);
          this.gotoPathAndWait(this.myTarget.x, this.myTarget.y, 1, "SEEK_TARGET");
        // TODO: decide on ally seeking behavior for opponents; 
        // causes them to be very busy once around an one of their own team
        // } else {
        //   // no nearby opponent found, so find some allies
        //   var nearestAllyFound = 
        //     findClosestOtherUnitInRange(this, unitSeekRange, allyUnits);

        //   if(nearestAllyFound != null) {
        //     var { distToGo, _, _ } = 
        //       this.distToGoWithDeltas(nearestAllyFound.x, nearestAllyFound.y);
        //     if (distToGo >= UNIT_RANKS_SPACING){
        //       // buddy up with nearest ally
        //       this.setTarget(nearestAllyFound);
        //       this.gotoNear(this.myTarget.x, this.myTarget.y, 1, 4);
        //     }
        //   } // end of if
        } // end of else, seek ally unit
      } // end of randomized ai response lag check
    } else if(this.playerControlled === true) {
      if(Math.random() < UNIT_RANDOM_LAG_CHECK) {
        // player opponent unit seeking
        // determine whether units are individually courageous or not
        var unitSeekRange = UNIT_PLAYER_ATTACK_INITIATE;
        if(Math.random() < modifiedCourage && this.isStopped()) {
          // widen unit seeking range
          unitSeekRange = UNIT_PLAYER_ATTACK_INITIATE * 2;
        }

        var nearestOpponentFound = 
          findClosestUnitInRange(this.x, this.y, unitSeekRange, opponentUnits);

        if(nearestOpponentFound != null) {
          this.setTarget(nearestOpponentFound);
          this.gotoPathAndWait(this.myTarget.x, this.myTarget.y, 1, "SEEK_TARGET");
        }
      } // end of randomized player unit response lag check
    } // end of playerControlled === true

    this.moveIncrement();
    this.keepInPlayableArea();
    this.moveDirection = this.resolveMoveDirection();
  } // end of move function

  this.checkForCollisions = function() {
    // respond to any unit in the same position
    var nearbyUnit = 
      findClosestOtherUnitInRange(this, UNIT_COLLISION_RADIUS, allUnits);

    if(nearbyUnit != null) {
      // check unit's bounding box reach relative the other unit's bounding box
      var { collided, isRightBy, isLeftBy, isDownBy, isUpBy } = this.isCollision(nearbyUnit);

      // check for a collision
      if (collided) {
        var battleWait = Math.floor(BATTLE_WAIT_LOOPS * Math.random() + 1);

        // if both units are still
        if (this.isStopped() && nearbyUnit.isStopped()) {
          // nudge this unit back, needs personal space
          this.nudgeUnit(-isRightBy, isLeftBy, -isDownBy, isUpBy);
          nearbyUnit.nudgeUnit(isRightBy, -isLeftBy, isDownBy, -isUpBy);
          this.stopMoving();
          nearbyUnit.stopMoving();
        } else {
          // going my way?
          var isGoingMyWay = 
            this.moveDirection === nearbyUnit.moveDirection ||
            this.moveDirection.indexOf(nearbyUnit.moveDirection) > -1 ||
            this.moveDirection.slice(0, 1).indexOf(nearbyUnit.moveDirection) > -1 ||
            this.moveDirection.slice(1).indexOf(nearbyUnit.moveDirection) > -1 ||
            nearbyUnit.moveDirection.indexOf(this.moveDirection) > -1 ||
            nearbyUnit.moveDirection.slice(0, 1).indexOf(this.moveDirection) > -1 ||
            nearbyUnit.moveDirection.slice(1).indexOf(this.moveDirection) > -1;

          if (this.unitColor != nearbyUnit.unitColor) {
            // attack nearby opponent unit, while still on target
            if (isGoingMyWay) {
              // opponent unit is facing away, so it dies
              nearbyUnit.dies();
            } else {
              // opponent unit is facing this unit, so battle!
              fightOutcome = Math.random();
              if (fightOutcome < 0.4) {
                // this unit dies
                this.dies();
              } else if (fightOutcome < 0.8) {
                // opponent unit dies
                nearbyUnit.dies();
              } else {
                // some shoving occurs, but no one gets hurt
                this.nudgeUnit(-isRightBy, isLeftBy, -isDownBy, isUpBy);
                nearbyUnit.nudgeUnit(isRightBy, -isLeftBy, isDownBy, -isUpBy);
                this.gotoPathAndWait(this.x, this.y, battleWait, "ENEMY_SHOVE");
                nearbyUnit.gotoPathAndWait(nearbyUnit.x, nearbyUnit.y, battleWait, "ENEMY_SHOVE");
              }
            }
          } else {
            // nearbyUnit is an ally
            if (this.isMoving() && nearbyUnit.isMoving()) {
              // yield and pauses movement for moving ally to pass
              if (isGoingMyWay) {
                nearbyUnit.nudgeUnit(isRightBy, -isLeftBy, isDownBy, -isUpBy);
              } else {
                this.nudgeUnit(-isRightBy, isLeftBy, -isDownBy, isUpBy);
                this.gotoPathAndWait(this.x, this.y, battleWait, "YIELD_WAY");
              }
            } else if (this.isStopped() && nearbyUnit.isMoving()) {
              // make way (swap places with) ally moving
              this.nudgeUnit(-isRightBy, isLeftBy, -isDownBy, isUpBy);
              this.makeWay(nearbyUnit);
              this.gotoPathAndWait(this.x, this.y, battleWait, "MAKE_WAY");
            } else if (this.isMoving() && nearbyUnit.isStopped()) {
              nearbyUnit.nudgeUnit(isRightBy, -isLeftBy, isDownBy, -isUpBy);
              this.makeWay(nearbyUnit);
              nearbyUnit.gotoPathAndWait(nearbyUnit.x, nearbyUnit.y, battleWait, "MAKE_WAY");
            } else {
              // catch all; shouldn't reach here
              console.log("checkForCollisions: nearbyUnit is ally - catch all; shouldn't reach here")
              this.stopMoving();
            }
          }
        }
        nearbyUnit.keepInPlayableArea();
      } // end of if, unit in immediate path

      soonCheckUnitsToClear();
    } // end of if, nearby unit detected

    this.moveIncrement();
    this.keepInPlayableArea();
    this.moveDirection = this.resolveMoveDirection();
  } // end of checkForCollisions function

  this.isMoving = function() {
    var isMoving = false;
    if (this.gotoQueue != null && this.gotoQueue.length > 0) {
      var location = this.gotoQueue[this.gotoQueue.length - 1];
      if (location != null) {
        if (location.x != undefined && location.y != undefined &&
          location.wait != undefined && location.wait > 0
        ) {
          isMoving = location.x != this.x || location.y != this.y;
        }
      }
    }

    isMoving ||= this.gotoX != this.x || this.gotoY != this.y;
    return isMoving;
  }

  this.isStopped = function() {
    return this.isMoving() === false;
  }

  this.stopMoving = function() {
    this.gotoX = this.x;
    this.gotoY = this.y;
    this.gotoQueue = [];
  }

  this.resolveMoveDirection = function() {
    var { gotoX, gotoY, _ } = this.getLatestGotoCoords();
    var moveX = gotoX - this.x;
    var moveY = gotoY - this.y;
    var moveDirection = unitClass.resolveMoveDirection(moveX, moveY);
    if (moveDirection === undefined || moveDirection === "ERROR_DIRECTION") {
      // if error, return current move direction
      moveDirection = this.moveDirection;
    }
    return moveDirection;
  }

  unitClass.resolveMoveDirection = function(moveX, moveY) {
    if(arguments.length < 2 || 
      ((moveX === 0 && moveY === 0) || 
      (moveX != moveX && moveY != moveY))
    ) {
      // JS trick to check for NaN, see https://stackoverflow.com/q/30314447
      return "ERROR_DIRECTION"; // return a non-direction character
    }

    if(Math.abs(moveX) / 2 > Math.abs(moveY)) {
      // then we are moving either E or W
      if(moveX > 0) {
        return "E";
      } else {
        return "W";
      }
    } else if(Math.abs(moveX) < Math.abs(moveY) / 2) {
      // then we are moving either N or S
      if(moveY > 0) {
        return "S";
      } else {
        return "N";
      }
    } else { // ie, neither moveX nor moveY is more than twice the other
      if(moveX > 0) {
        if(moveY > 0) {
          return "SE";
        } else {
          return "NE";
        }
      } else { // moveX < 0
        if(moveY > 0) {
          return "SW";
        } else {
          return "NW";
        }
      }
    }
  }

  unitClass.isCollision = function(unit1, unit2) {
    // check for a collision
    var twoUnitRanksWide = UNIT_COLLISION_RADIUS * 2;
    var isRightBy = Math.round((unit1.x + UNIT_COLLISION_RADIUS - unit2.x)*1000)/1000;
    var isLeftBy = Math.round((twoUnitRanksWide - isRightBy)*1000)/1000;
    var isDownBy = Math.round((unit1.y + UNIT_COLLISION_RADIUS - unit2.y)*1000)/1000;
    var isUpBy = Math.round((twoUnitRanksWide - isDownBy)*1000)/1000;

    var maxMoveX = Math.round(Math.max(Math.abs(unit1.moveX), Math.abs(unit2.moveX))*1000)/1000;
    var maxMoveY = Math.round(Math.max(Math.abs(unit1.moveY), Math.abs(unit2.moveY))*1000)/1000;
    var collided = 
      isRightBy > maxMoveX && isRightBy < twoUnitRanksWide &&
      isLeftBy > maxMoveX && isLeftBy < twoUnitRanksWide &&
      isDownBy > maxMoveY && isDownBy < twoUnitRanksWide &&
      isUpBy > maxMoveY && isUpBy < twoUnitRanksWide;
    return { collided, isRightBy, isLeftBy, isDownBy, isUpBy };
  }

  this.isCollision = function(otherUnit) {
    var isCollision = unitClass.isCollision(this, otherUnit);
    return isCollision;
  }

  this.getLatestGotoCoords = function() {
    var gotoX = this.gotoX;
    var gotoY = this.gotoY;
    var location = null;
    // look at latest queue location for latest goto path
    if (this.gotoQueue.length > 0) {
      location = this.gotoQueue[this.gotoQueue.length - 1];
      if (location != null) {
        if (location.wait != undefined)  {
          if (location.wait <= 0) {
            // pop location off the queue after wait is over
            this.gotoQueue.pop();
            // if (this.gotoQueue.length > 0) {
            //   // grab the next location
            //   location = this.gotoQueue[this.gotoQueue.length - 1];
            // }
          } else if (location.x != undefined && location.y != undefined) {
            gotoX = location.x;
            gotoY = location.y;
          }
        }
      }
    }
    return { gotoX, gotoY };
  }

  this.distToGoWithDeltas = function(gotoX, gotoY) {
    var deltaX = gotoX - this.x;
    var deltaY = gotoY - this.y;
    var distToGo = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    return { distToGo, deltaX, deltaY };
  }

  this.moveIncrement = function() {
    var { gotoX, gotoY } = this.getLatestGotoCoords();
    var { distToGo, deltaX, deltaY } = this.distToGoWithDeltas(gotoX, gotoY);
    var distToGoReciprocal = 0;
    if(distToGo != 0) { 
      distToGoReciprocal = 1 / distToGo;
    };

    // set incremental move variables
    this.moveX = UNIT_PIXELS_MOVE_RATE * deltaX * distToGoReciprocal;
    this.moveY = UNIT_PIXELS_MOVE_RATE * deltaY * distToGoReciprocal;    

    if (distToGo > UNIT_PIXELS_MOVE_RATE) {
      this.x += this.moveX;
      this.y += this.moveY;
    } else if (distToGo > 0) {
      this.x = gotoX;
      this.y = gotoY;
    } else {
      this.waitAtGotoQueueLocation();
    }

    // finally, avoid walking through trees and rocks
    this.avoidMapObstacles();

  }

  this.avoidMapObstacles = function() { // $CTK
        //console.log("unit "+this.id+" avoiding obstacles at pos="+this.x+","+this.y);
        //console.log(levelGrid,level_cols,level_rows,level_width,LEVEL_TILE_W,level_height,LEVEL_TILE_H);
        let myGridX = Math.floor(this.x / LEVEL_TILE_W);
        let myGridY = Math.floor(this.y / LEVEL_TILE_H);
        let myTile = levelGrid[myGridX+myGridY*level_cols];
        if (myTile != 11) {
            // exit the tile slowly
            //console.log("I am on tile "+myGridX+","+myGridY+" which is "+myTile);
            let tileCenterX = myGridX * LEVEL_TILE_W + LEVEL_TILE_W/2;
            let tileCenterY = myGridY * LEVEL_TILE_H + LEVEL_TILE_H/2;
            if (this.x<tileCenterX) this.x -= 2; else this.x += 2;
            if (this.y<tileCenterY) this.y -= 2; else this.y += 2;
        }
  };


  this.makeWay = function(otherUnit) {
    if (otherUnit != null) {
      // swap places
      var thisX = this.x;
      var thisY = this.y;
      this.x = otherUnit.x;
      this.y = otherUnit.y;
      otherUnit.x = thisX;
      otherUnit.y = thisY;
    }
  }

  this.nudgeUnit = function(nudgeLeftBy, nudgeRightBy, nudgeUpBy, nudgeDownBy) {
    // nudge unit a distance on x and y axis
    var bounceMultiplier = 1;
    var nudgeX = 0
    var nudgeY = 0;

    if (Math.abs(nudgeLeftBy) < Math.abs(nudgeRightBy)) {
      nudgeX = nudgeLeftBy;
    } else {
      nudgeX = nudgeRightBy;
    }

    if (Math.abs(nudgeUpBy) < Math.abs(nudgeDownBy)) {
      nudgeY = nudgeUpBy;
    } else {
      nudgeY = nudgeDownBy;
    }

    // only nudge along the axis w/ smallest change 
    if (Math.abs(nudgeX) < Math.abs(nudgeY)) {
      nudgeX *= bounceMultiplier;
      this.x += nudgeX;
    } else {
      nudgeY *= bounceMultiplier;
      this.y += nudgeY;
    }
  }

  this.gotoPathAndWait = function(x, y, wait, reason) {
    // default the parameters where they are missing
    switch(arguments.length) {
      case 0: x = this.x; // fall-through
      case 1: y = this.y; // fall-through
      case 2: wait = 1;
      case 3: reason = "STAY_PUT_" + (Math.random() * 100).toString();
    }

    if (this.gotoQueue != null && this.gotoQueue.length > 0) {
      // clean out exist locations matching reason
      var worthyWaitQueue = [];
      for(var i=0;i<this.gotoQueue.length;i++){
        var location = this.gotoQueue[i];
        if (location != null && location.wait != undefined && 
          location.wait > 0 && reason != location.reason
        ) {
          worthyWaitQueue.push(this.gotoQueue[location]);
        }
      }

      this.gotoQueue = worthyWaitQueue;
    }

    if (this.gotoQueue.length < this.gotoQueueLimit) {
      this.gotoQueue.push({ x: x, y: y, wait: wait, reason: reason });
    }
  }

  this.waitAtGotoQueueLocation = function() {
    if (this.gotoQueue.length > 0) {
      var location = this.gotoQueue[this.gotoQueue.length - 1];
      if (location != undefined && 
        location.wait != undefined && 
        location.wait > 0
      ) {
        this.gotoQueue[this.gotoQueue.length - 1].wait--;
      }
    }
  }

  this.gotoNear = function(aroundX, aroundY, formationPos, formationDim) {
    this.stopMoving();
    this.clearTarget();
    var colNum = formationPos % formationDim;
    var rowNum = Math.floor(formationPos / formationDim);
    this.gotoX = aroundX + colNum*UNIT_RANKS_SPACING;
    this.gotoY = aroundY + rowNum*UNIT_RANKS_SPACING;
    this.gotoPathAndWait(this.gotoX, this.gotoY, 100, "GOTO_NEAR");
  }

  this.keepInPlayableArea = function() {
    if(this.gotoX < UNIT_PLAYABLE_AREA_MARGIN) {
      this.gotoX = UNIT_PLAYABLE_AREA_MARGIN;
    } else if(this.gotoX > level_width-UNIT_PLAYABLE_AREA_MARGIN) {
      this.gotoX = level_width-UNIT_PLAYABLE_AREA_MARGIN;
    }
    if(this.gotoY < UNIT_PLAYABLE_AREA_MARGIN) {
      this.gotoY = UNIT_PLAYABLE_AREA_MARGIN;
    } else if(this.gotoY > level_height-UNIT_PLAYABLE_AREA_MARGIN) {
      this.gotoY = level_height-UNIT_PLAYABLE_AREA_MARGIN;
    }
  }

  this.setTarget = function(newTarget) {
    this.myTarget = newTarget;
  }

  this.clearTarget = function() {
    this.myTarget = null;
  }

  this.isInBox = function(x1, y1, x2, y2) {
    var leftX, rightX;
    if(x1 < x2) {
      leftX = x1;
      rightX = x2;
    } else {
      leftX = x2;
      rightX = x1;
    }
    
    var topY, bottomY;
    if(y1 < y2) {
      topY = y1;
      bottomY = y2;
    } else {
      topY = y2;
      bottomY = y1;
    }
    
   if(this.x < leftX) {
      return false;
    }
    if(this.y < topY) {
      return false;
    }
    if(this.x > rightX) {
      return false;
    }
    if(this.y > bottomY) {
      return false;
    }
    return true;
  }

  this.distFrom = function(otherX, otherY) {
    var deltaX = otherX - this.x;
    var deltaY = otherY - this.y;
    return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
  }

  this.drawSelectionBox = function() {
    coloredOutlineRectCornerToCorner( this.x-UNIT_SELECT_DIM_HALF,
                                      this.y-UNIT_SELECT_DIM_HALF,
                                      this.x+UNIT_SELECT_DIM_HALF,
                                      this.y+UNIT_SELECT_DIM_HALF, 'blue' );
  }

  this.draw = function() {
    if(this.isDead === false) {
      let moveAng = 0;
      switch(this.moveDirection) {
        case "N":
          moveAng = 0;
          break;
        case "NE":
          moveAng = 45;
          break;
        case "E":
          moveAng = 90;
          break;
        case "SE":
          moveAng = 135;
          break;
        case "S":
          moveAng = 180;
          break;
        case "SW":
          moveAng = 225;
          break;
        case "W":
          moveAng = 270;
          break;
        case "NW":
          moveAng = 315;
          break;
        default:
          moveAng = 0;
      }

      // convert to radians
      moveAng = moveAng * Math.PI / 180;

      //TODO: draw unit sprite (var placeholderUnitWalk or placeholderUnitAtk, each as 2 frames)

      //colorCircle(this.x,this.y, UNIT_PLACEHOLDER_RADIUS, this.unitColor);
      
      // found this and uncommented for testing to tell the diff in units
      if (this.playerControlled) {
        drawBitmapCenteredWithRotation(yellowPeasantUnitSingleFrame, this.x, this.y, moveAng);
      } else {
        drawBitmapCenteredWithRotation(redPeasantUnitSingleFrame, this.x, this.y, moveAng);
      }
      
      if(gameOptions.showDebug) {
        colorText(this.moveDirection, this.x,this.y, "blue");
        // add indicator of unit id
        colorText(this.id, this.x, this.y + UNIT_RANKS_SPACING, "magenta");
      }
    } else {
      colorCircle(this.x,this.y, UNIT_PLACEHOLDER_RADIUS, "yellow");
    }
  }

  this.dies = function() {
    this.isDead = true;
  }
}

