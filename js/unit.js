const UNIT_PLACEHOLDER_RADIUS = 10;
const UNIT_SELECT_DIM_HALF = UNIT_PLACEHOLDER_RADIUS + 3;
const UNIT_PIXELS_MOVE_RATE = 2;
const UNIT_RANKS_SPACING = UNIT_PLACEHOLDER_RADIUS *3;
const UNIT_ATTACK_RANGE = 55;
const UNIT_AI_ATTACK_INITIATE = UNIT_ATTACK_RANGE + 10;
const UNIT_PLAYABLE_AREA_MARGIN = 20;

function unitClass() {
  this.resetAndSetPlayerTeam = function(playerTeam) {
    this.playerControlled = playerTeam;
    this.x = Math.random()*canvas.width/4;
    this.y = Math.random()*canvas.height/4;
    this.moveDirection = "S";
    this.myTarget = null;

    // Flip all non-player units to opposite corner
    if(this.playerControlled == false) {
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
  }

  this.move = function() {
    if(this.myTarget != null) {
      if(this.myTarget.isDead) {
        this.myTarget = null;
        this.gotoX = this.x;
        this.gotoY = this.y;
      } else if(this.distFrom(this.myTarget.x, this.myTarget.y) > UNIT_ATTACK_RANGE) {
        this.gotoX = this.myTarget.x;
        this.gotoY = this.myTarget.y;
      } else {
        this.myTarget.isDead = true;
        this.gotoX = this.x;
        this.gotoY = this.y;
        soonCheckUnitsToClear();
      }
    } else if(this.playerControlled == false) {
      if(Math.random() < 0.02) {
        var nearestOpponentFound = 
          findClosestUnitInRange(this.x, this.y, 
            UNIT_AI_ATTACK_INITIATE, playerUnits);

        if(nearestOpponentFound != null) {
          this.myTarget = nearestOpponentFound;
        } else {
          this.gotoX = this.x - Math.random()*70;
          this.gotoY = this.y - Math.random()*70;
        } // end of else, no target found in attack radius
      } // end of randomized ai resoponse lag check
    } // end of playerControlled == false (i.e. code block for computer control)

    this.keepInPlayableArea();
    var deltaX = this.gotoX - this.x;
    var deltaY = this.gotoY - this.y;
    var distToGo = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    var moveX = UNIT_PIXELS_MOVE_RATE * deltaX/distToGo;
    var moveY = UNIT_PIXELS_MOVE_RATE * deltaY/distToGo;

    this.moveDirection = this.resolveMoveDirection(moveX, moveY);

    if(distToGo > UNIT_PIXELS_MOVE_RATE) {
      this.x += moveX;
      this.y += moveY;
    } else {
      this.x = this.gotoX;
      this.y = this.gotoY;

    }
  } // end of move function

  this.resolveMoveDirection = function(moveX, moveY) {
    if( (moveX === 0 && moveY === 0) || 
        (moveX !== moveX && moveY !== moveY) ) {
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
    if(this.isDead == false) {
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
      drawBitmapCenteredWithRotation(placeholderUnitSingleFrame, this.x, this.y, moveAng)
      colorText(this.moveDirection, this.x,this.y, "blue");
    } else {
      colorCircle(this.x,this.y, UNIT_PLACEHOLDER_RADIUS, "yellow");
    }
  }
}

