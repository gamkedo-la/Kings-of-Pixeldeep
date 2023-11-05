var playerArmies = [];
var enemyArmies = [];
var allArmies = [];

var playerCities = [];
var playerGold = 10;

var enemyCities = [];
var enemyGold = 10; // may not actually use this, just added for consistency

var neutralCities = [];

var allCities = [];

var selectedWorldEntity = null;
var selectedWorldEntityIndex = -1;

// WORLD MAP SETUP

var city1  = new cityClass({
    worldCol: 8,
    worldRow: 8,
    cityType: CITY_TYPE_PLAYER,
    name: 'city1',
});
playerCities.push(city1);
allCities.push(city1);

var city2  = new cityClass({
    worldCol: 31,
    worldRow: 7,
    cityType: CITY_TYPE_ENEMY,
    name: 'city2',
});
enemyCities.push(city2);
allCities.push(city2);

var city3  = new cityClass({
    worldCol: 10,
    worldRow: 24,
    cityType: CITY_TYPE_NEUTRAL,
    name: 'city3',
});
neutralCities.push(city3);
allCities.push(city3);

var city4  = new cityClass({
    worldCol: 30,
    worldRow: 25,
    cityType: CITY_TYPE_NEUTRAL,
    name: 'city4',
});
neutralCities.push(city4);
allCities.push(city4);

var army1  = new armyClass({
    worldCol: 7,
    worldRow: 5,
    name: "My First Army",
    troops: {
        peasants: 20,
    }
});
playerArmies.push(army1);
allArmies.push(army1);

var army2 = new armyClass({
    worldCol: 30,
    worldRow: 9,
    name: "Enemy Army",
    playerControlled: false,
    troops: {
        peasants: 10,
        spearmen: 10,
    }
});

if (quickBattleDebug) {
	army2.worldCol = 10;
}
enemyArmies.push(army2);
allArmies.push(army2);

//var army3  = new armyClass({
//    worldCol: 7,
//    worldRow: 25,
//    name: "army3",
//    troops: {
//        peasants: 30,
//    }
//});
//playerArmies.push(army3);
//allArmies.push(army3);

// BATTLE CHECK FUNCTIONS
// these should definately go someplace else, but it's where I can think to put them for now
function isEnemyArmyAtPosition(col, row) {
    for(var i=0;i<enemyArmies.length;i++) {
        let checkArmy = enemyArmies[i];
        if(checkArmy.worldRow == row && checkArmy.worldCol == col) {
            return true;
        }
    }
    
    return false;
}

function isPlayerArmyAtPosition(col, row) {
    for(var i=0;i<playerArmies.length;i++) {
        let checkArmy = playerArmies[i];
        if(checkArmy.worldRow == row && checkArmy.worldCol == col) {
            return true;
        }
    }
    
    return false;
}

let e = 0; // index of enemyArmy currently moving
function runEnemyTurn() {
    if (enemyArmies.length > 0) {
        const onAnimationEnded = function() {
            enemyArmies[e].eventTarget.removeEventListener('animationEnded', onAnimationEnded);

            e++;
            if (enemyArmies[e]) { // If there is an enemy army at e
                enemyArmies[e].eventTarget.addEventListener('animationEnded', onAnimationEnded);
                enemyArmies[e].AIMove();
            }
            else { // If not, reset e to prepare for next turn
                e = 0;
                selectNextAvailableArmy();
            }
        }
        enemyArmies[e].eventTarget.addEventListener('animationEnded', onAnimationEnded);
        enemyArmies[e].AIMove();
    }

    // randomly spawn enemy-controlled armies every
    // few turns, ramping up army difficulty and freqency 
    // as the game goes on
    
    let turnNumberFactor = 0.001; // higher makes enemy army spawn rate ramp up faster
    
    if (Math.random() + (turnNumber * turnNumberFactor) > 0.75) { 
        // roughly 1/4 of the time to start, ramping up over time
        let milisecondTimestamp = Date.now();
        let cityIdx = Math.floor(Math.random() * enemyCities.length);
        let newArmy = new armyClass({
            worldCol: enemyCities[cityIdx].worldCol - 1,
            worldRow: enemyCities[cityIdx].worldRow,
            name: "Enemy Army " + milisecondTimestamp,
            playerControlled: false,
            troops: {
                peasants: (Math.floor(Math.random()*20) + 10),
                    // random number of peasants between 10 and 30
                spearmen: (Math.random() > 0.5 ? Math.floor(Math.random()*10) : 0),
                    // coin flip to have spearmen at all; if so, random number between 1 and 10 of them
            }
        });
        enemyArmies.push(newArmy);
        allArmies.push(newArmy);
    }

    endTurn(); // this may cause recursion, not sure
}

function tryToCapture(city, withArmy) {
    if(withArmy.playerControlled) {
        if(city.cityType == CITY_TYPE_PLAYER) {
            console.log('city is player controlled already, no need to capture');
        } else {
            console.log('player capturing city: ', city.name);
            // change to a player city
            city.cityType = CITY_TYPE_PLAYER;

            // remove this city from neutral and/or enemy city arrays
            enemyCities = enemyCities.filter(checkCity => checkCity.name !== city.name);
            neutralCities = neutralCities.filter(checkCity => checkCity.name !== city.name);

            // add to player cities array
            playerCities.push(city);
        }
    } else { // withArmy must be an enemy army
        if(city.cityType == CITY_TYPE_ENEMY) {
            console.log('city is enemy controlled already, no need to capture');
        } else {
            console.log('enemy capturing city: ', city.name);
            // change to a enemy city
            city.cityType = CITY_TYPE_ENEMY;

            // remove this city from neutral and/or player city arrays
            playerCities = playerCities.filter(checkCity => checkCity.name !== city.name);
            neutralCities = neutralCities.filter(checkCity => checkCity.name !== city.name);

            // add to enemy cities array
            enemyCities.push(city);
        }
    }
}

function checkWinConditions() {
    console.log('checking win conditions');
    if(playerCities.length === allCities.length) {
        console.log("Player Wins");
        winner = 'player';

        showEndGameDialogScreen = true;
    }

    if(enemyCities.length === allCities.length) {
        console.log("Enemy Wins");
        winner = 'enemy';

        showEndGameDialogScreen = true;
    }
}

function makePlayerWin() {
    for (const city of allCities) {
        if(!playerCities.includes(city)) {
            city.cityType = CITY_TYPE_PLAYER;
            playerCities.push(city);
        }
    }
}

function makeEnemyWin() {
    for (const city of allCities) {
        if(!enemyCities.includes(city)) {
            city.cityType = CITY_TYPE_ENEMY;
            enemyCities.push(city);
        }
    }
}
