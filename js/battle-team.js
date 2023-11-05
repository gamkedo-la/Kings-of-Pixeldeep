//const PLAYER_START_UNITS = 20;
//const ENEMY_START_UNITS = 15;

var playerUnits = [];
var enemyUnits = [];
var allUnits = [];

var anyNewUnitsToClear = false;
var playerSurrenders = false;

function clearBattleUnits() {
    playerUnits   = [];
    enemyUnits    = [];
    allUnits      = [];
    selectedUnits = [];
}

function soonCheckUnitsToClear() {
    anyNewUnitsToClear = true;
}

function checkAndHandleVictory() {
    let battleIsOver = false;

    if(playerUnits.length == 0 && enemyUnits.length == 0) {
        battleIsOver = true;

        if(gameOptions.showDebug) {
            document.getElementById("debugText").innerHTML = "IT'S... A... DRAW?";
        }

        if(playerBattleArmy || enemyBattleArmy) {
            playerArmies = playerArmies.filter(
                army => army.name !== playerBattleArmy.name
            );
            allArmies = allArmies.filter(
                army => army.name !== playerBattleArmy.name
            );

            enemyArmies = enemyArmies.filter(
                army => army.name !== enemyBattleArmy.name
            );
            allArmies = allArmies.filter(
                army => army.name !== enemyBattleArmy.name
            );

            playerBattleArmy.clearTroops();
            enemyBattleArmy.clearTroops();
        }
    } else if(playerUnits.length == 0 || playerSurrenders) {
        battleIsOver = true;

        if(gameOptions.showDebug) {
            document.getElementById("debugText").innerHTML = "ENEMY TEAM WON";
        }

        console.log('battle over, enemy won');

        if(playerBattleArmy || enemyBattleArmy) {
            playerArmies = playerArmies.filter(
                army => army.name !== playerBattleArmy.name
            );
            allArmies = allArmies.filter(
                army => army.name !== playerBattleArmy.name
            );

            let enemyTroops = enemyBattleArmy.unitTroopRoster(enemyUnits);
            enemyBattleArmy.troops.peasants = enemyTroops.peasants;
            enemyBattleArmy.troops.archers = enemyTroops.archers;
            enemyBattleArmy.troops.spearmen = enemyTroops.spearmen;
            enemyBattleArmy.troops.horsemen = enemyTroops.horsemen;

            let playerTroops = playerBattleArmy.unitTroopRoster(playerUnits);
            enemyBattleArmy.capturedTroops.peasants += playerTroops.peasants;
            enemyBattleArmy.capturedTroops.archers += playerTroops.archers;
            enemyBattleArmy.capturedTroops.spearmen += playerTroops.spearmen;
            enemyBattleArmy.capturedTroops.horsemen += playerTroops.horsemen;

            playerBattleArmy.clearTroops();
        }
    } else if(enemyUnits.length == 0) {
        battleIsOver = true;

        if(gameOptions.showDebug) {
            document.getElementById("debugText").innerHTML = "PLAYER TEAM WON";
        }

        console.log('battle over, player won');

        if(playerBattleArmy || enemyBattleArmy) {
            enemyArmies = enemyArmies.filter(
                army => army.name !== enemyBattleArmy.name
            );
            allArmies = allArmies.filter(
                army => army.name !== enemyBattleArmy.name
            );

            let playerTroops = playerBattleArmy.unitTroopRoster(playerUnits);
            playerBattleArmy.troops.peasants = playerTroops.peasants;
            playerBattleArmy.troops.archers = playerTroops.archers;
            playerBattleArmy.troops.spearmen = playerTroops.spearmen;
            playerBattleArmy.troops.horsemen = playerTroops.horsemen;

            let enemyTroops = playerBattleArmy.unitTroopRoster(enemyUnits);
            playerBattleArmy.capturedTroops.peasants += enemyTroops.peasants;
            playerBattleArmy.capturedTroops.archers += enemyTroops.archers;
            playerBattleArmy.capturedTroops.spearmen += enemyTroops.spearmen;
            playerBattleArmy.capturedTroops.horsemen += enemyTroops.horsemen;

            enemyBattleArmy.clearTroops();
        }
    }

    if (battleIsOver) {
        playerSurrenders = false;
        clearBattleUnits();
        setupWorldMode();
    }
}

function handlePlayerBattleSurrender() {
    playerSurrenders = true;
    checkAndHandleVictory();
    clearBattleUnits();
    //setupBattleMode(); // get a new map for next battle mode
    requestWorldMode('battle');
}

function addNewUnitToTeam(spawnedUnit, fightsForTeam) {
    fightsForTeam.push(spawnedUnit);
    allUnits.push(spawnedUnit);
}

function populateTeam(whichTeam, armyTroops, isPlayerControlled) {
    for(var i=0;i<armyTroops.peasants;i++) {
        var spawnUnit = new unitClass();
        spawnUnit.resetAndSetPlayerTeam(isPlayerControlled, 'peasant');
        addNewUnitToTeam(spawnUnit, whichTeam);
    }
    for(var i=0;i<armyTroops.spearmen;i++) {
        var spawnUnit = new unitClass();
        spawnUnit.resetAndSetPlayerTeam(isPlayerControlled, 'spearman');
        addNewUnitToTeam(spawnUnit, whichTeam);
    }
}

function findClosestUnitInRange(fromX, fromY, maxRange, inUnitList) {
    var nearestUnitDist = maxRange;
    var nearestUnitFound = null;
    for(var i=0;i<inUnitList.length;i++) {
        var otherUnit = inUnitList[i];
        var distTo = otherUnit.distFrom(fromX, fromY);
        if(distTo < nearestUnitDist) {
            nearestUnitDist = distTo;
            nearestUnitFound = otherUnit;
        }
    }
    return nearestUnitFound;
}

// like findClosestUnitInRange, but is from a given unit's perspective
function findClosestOtherUnitInRange(fromUnit, maxRange, inUnitList) {
    var nearestUnitDist = maxRange;
    var nearestUnitFound = null;
    for(var i=0;i<inUnitList.length;i++) {
        if (fromUnit.id === inUnitList[i].id) {
            // ensure that the from unit isn't chosen as it's own nearest
            continue;
        }
        var distTo = inUnitList[i].distFrom(fromUnit.x, fromUnit.y);
        if(distTo < nearestUnitDist) {
            nearestUnitDist = distTo;
            nearestUnitFound = inUnitList[i];
        }
    }
    return nearestUnitFound;
}

function removeDeadUnitsFromList(fromArray) {
  // looping from the end like this eliminates units getting skipped
  // as array indecies shuffle during deletion
  for(var i=fromArray.length-1; i>=0; i--) {
    if(fromArray[i].isDead) {
      fromArray.splice(i,1);
    }
  }
}

function removeDeadUnits() {
  if(anyNewUnitsToClear) {
    removeDeadUnitsFromList(allUnits);
    removeDeadUnitsFromList(playerUnits);
    removeDeadUnitsFromList(enemyUnits);
    removeDeadUnitsFromList(selectedUnits);

    anyNewUnitsToClear = false;
  }
}
