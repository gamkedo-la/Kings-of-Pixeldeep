const UNIT_PLACEHOLDER_RADIUS = 10;
const UNIT_SELECT_DIM_HALF = UNIT_PLACEHOLDER_RADIUS + 3;
const UNIT_PIXELS_MOVE_RATE = 2.2;
const UNIT_RANKS_SPACING = UNIT_PLACEHOLDER_RADIUS *3.5;
const UNIT_COLLISION_RADIUS = 20;
const UNIT_ATTACK_RANGE = 55;
const UNIT_AI_ATTACK_INITIATE = UNIT_ATTACK_RANGE + 10;
const UNIT_PLAYABLE_AREA_MARGIN = 20;
const UNIT_NEARBY_UNIT_SEEK_RANGE = 
  Math.max(canvas.width, canvas.height) - UNIT_PLAYABLE_AREA_MARGIN;

function unitClass() {
  this.resetAndSetPlayerTeam = function(playerTeam) {
    this.receiveId();
    this.playerControlled = playerTeam;

    // get units in formation from the start
    this.x = Math.random()*canvas.width/4;
    this.x += 30;
    this.y = Math.random()*canvas.height/4;
    this.y += 30;

    this.moveX = 0;
    this.moveY = 0;

    // queue for x, y goto data when an extended path is necessary
    this.gotoQueue = [];
    this.gotoQueueLimit = 2;

    this.moveDirection = "S";
    this.myTarget = null;
    this.maxDistancePerTurn = 100;

    // Flip all non-player units to opposite corner
    if(this.playerControlled === false) {
      var unitsAlongside = Math.floor(Math.sqrt(enemyUnits.length+3));
      this.x = canvas.width - this.x;
      this.y = canvas.height - this.y;
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

    if(this.myTarget != null) {
      if(this.myTarget.isDead) {
        this.myTarget = null;
        this.stopMoving();
      } else if(this.distFrom(this.myTarget.x, this.myTarget.y) > UNIT_ATTACK_RANGE) {
        this.gotoX = this.myTarget.x;
        this.gotoY = this.myTarget.y;
      } else {
        // allow for myTarget to be an ally, but only to seek and join up
        if(this.myTarget.playerControlled != this.playerControlled) {
          this.myTarget.isDead = true;
        }
        this.stopMoving();
        soonCheckUnitsToClear();
      }
    } else if(this.playerControlled === false) {
      if(Math.random() < 0.02) {
        var nearestOpponentFound = 
          findClosestUnitInRange(this.x, this.y, 
            UNIT_NEARBY_UNIT_SEEK_RANGE, opponentUnits);

        if(nearestOpponentFound != null) {
          this.myTarget = nearestOpponentFound;
        } else {
          // no nearby opponent found, so find some allies
          var nearestAllyFound = 
          findClosestUnitInRange(this.x, this.y, 
            UNIT_NEARBY_UNIT_SEEK_RANGE, allyUnits);

          if(nearestAllyFound != null) {
            this.myTarget = nearestAllyFound;
            // buddy up with nearest ally, gotoNear(x, y, 1 for second unit (in 
            // pair) and 5 for 2 units along side (in pair) + 3
            gotoNear(nearestAllyFound.x, nearestAllyFound.y, 1, 5);
          } else {
            this.gotoX = this.x + directionModifier * Math.random()*70;
            this.gotoY = this.y + directionModifier * Math.random()*70;
          } // end of else, no nearby ally unit found to buddy-up with
        } // end of else, no nearby target found
      } // end of randomized ai response lag check
    } // end of playerControlled === false (i.e. code block for computer control)

    this.moveIncrement();
    this.keepInPlayableArea();
    this.moveDirection = 
      this.resolveMoveDirection(this.gotoX - this.x, this.gotoY - this.y);
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
        // if both units are still
        if (this.isStopped() && nearbyUnit.isStopped()) {
          // nudge this unit back, needs personal space
          this.nudgeUnit(-isRightBy, isLeftBy, -isDownBy, isUpBy);
          nearbyUnit.nudgeUnit(isRightBy, -isLeftBy, isDownBy, -isUpBy);
          this.stopMoving();
          nearbyUnit.stopMoving();
        } else {
          var battleWait = 20;
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
              nearbyUnit.isDead = true;
            } else {
              // opponent unit is facing this unit, so battle!
              fightOutcome = Math.random();
              if (fightOutcome < 0.4) {
                // this unit dies
                this.isDead = true;
              } else if (fightOutcome < 0.8) {
                // opponent unit dies
                nearbyUnit.isDead = true;
              } else {
                // some shoving occurs, but one gets hurt
                this.nudgeUnit(-isRightBy, isLeftBy, -isDownBy, isUpBy);
                nearbyUnit.nudgeUnit(isRightBy, -isLeftBy, isDownBy, -isUpBy);
                this.gotoPathAndWait(this.x, this.y, Math.floor(battleWait * Math.random()), "ENEMY_SHOVE");
                nearbyUnit.gotoPathAndWait(nearbyUnit.x, nearbyUnit.y, Math.floor(battleWait * Math.random()), "ENEMY_SHOVE");
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
                this.gotoPathAndWait(this.x, this.y, Math.floor(battleWait * Math.random()), "YIELD_WAY");
              }
            } else if (this.isStopped() && nearbyUnit.isMoving()) {
              // make way (swap places with) ally moving
              this.nudgeUnit(-isRightBy, isLeftBy, -isDownBy, isUpBy);
              this.makeWay(nearbyUnit);
              this.gotoPathAndWait(this.x, this.y, Math.floor(battleWait * Math.random()), "MAKE_WAY");
              // this.stopMoving();
            } else if (this.isMoving() && nearbyUnit.isStopped()) {
              nearbyUnit.nudgeUnit(isRightBy, -isLeftBy, isDownBy, -isUpBy);
              this.makeWay(nearbyUnit);
              nearbyUnit.gotoPathAndWait(nearbyUnit.x, nearbyUnit.y, Math.floor(battleWait * Math.random()));
            } else {
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
  } // end of checkForCollisions function

  this.isMoving = function() {
    var isMoving = false;
    if (this.gotoQueue != null && this.gotoQueue.length > 0) {
      location = this.gotoQueue[this.gotoQueue.length - 1];
      if (location.x != this.x || location.y != this.y) {
        isMoving = true;
      }
    }
    return isMoving || this.gotoX != this.x || this.gotoY != this.y ;
  }

  this.isStopped = function() {
    return this.isMoving() === false;
  }

  this.stopMoving = function() {
    this.gotoX = this.x;
    this.gotoY = this.y;
    this.gotoQueue = [];
  }

  this.resolveMoveDirection = function(moveX, moveY) {
    if( (moveX === 0 && moveY === 0) || 
        (moveX != moveX && moveY != moveY) ) {
        // JS trick to check for NaN, see https://stackoverflow.com/q/30314447
      return this.moveDirection;
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

  this.moveIncrement = function() {
    var gotoX = this.gotoX;
    var gotoY = this.gotoY;
    if (this.gotoQueue != null && this.gotoQueue.length > 0) {
      var location = this.gotoQueue[this.gotoQueue.length - 1];
      if (location.wait <= 0) {
        // pop location off the queue after wait is over
        this.gotoQueue.pop();
        if (this.gotoQueue.length > 0) {
          // grab the next location
          location = this.gotoQueue[this.gotoQueue.length - 1];
        }
      }
      if (location != null) {
        gotoX = location.x;
        gotoY = location.y;
        location.wait--; 
      }
    }

    var deltaX = gotoX - this.x;
    var deltaY = gotoY - this.y;
    var distToGo = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
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
      this.x = this.gotoX;
      this.y = this.gotoY;
    }
  }

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

  this.gotoPathAndWait = function(x, y, wait, reason=(Math.random() * 100).toString()) {
    if (this.gotoQueue != null && this.gotoQueue.length > 0) {
      var worthyWaitQueue = [];
      for(var i=0;i<this.gotoQueue.length;i++){
        var location = this.gotoQueue[i];
        if (location.wait > 0 && reason != location.reason) {
          worthyWaitQueue.add(this.gotoQueue[location]);
        }
      }

      this.gotoQueue = worthyWaitQueue;

      if (this.gotoQueue.length < this.gotoQueueLimit) {
        this.gotoQueue.push({ x: x, y: y, wait: wait, reason: reason });
      }
    }
  }

  this.gotoNear = function(aroundX, aroundY, formationPos, formationDim) {
    var colNum = formationPos % formationDim;
    var rowNum = Math.floor(formationPos / formationDim);
    this.gotoX = aroundX + colNum*UNIT_RANKS_SPACING;
    this.gotoY = aroundY + rowNum*UNIT_RANKS_SPACING;
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
}

