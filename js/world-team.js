var playerArmies = [];
var enemyArmies = [];
var allArmies = [];

var playerCities = [];
var playerGold = 10;

var enemyCities = [];
var enemyGold = 10; // may not actually use this, just added for consistency

var neutralCities = [];

var selectedWorldEntity = null;

// WORLD MAP SETUP

var city1  = new cityClass({
    worldCol: 8,
    worldRow: 8,
    cityType: CITY_TYPE_PLAYER,
});
playerCities.push(city1);

var city2  = new cityClass({
    worldCol: 31,
    worldRow: 7,
    cityType: CITY_TYPE_ENEMY,
});
enemyCities.push(city2);

var city3  = new cityClass({
    worldCol: 10,
    worldRow: 24,
    cityType: CITY_TYPE_NEUTRAL,
});
neutralCities.push(city3);

var city4  = new cityClass({
    worldCol: 30,
    worldRow: 25,
    cityType: CITY_TYPE_NEUTRAL,
});
neutralCities.push(city4);

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
    worldCol: 12,//30,
    worldRow: 6,//9,
    name: "Enemy Army",
    playerControlled: false,
    troops: {
        peasants: 10,
    }
});
enemyArmies.push(army2);
allArmies.push(army2);

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

function runEnemyTurn() {
    for(const army of enemyArmies) {
        army.AIMove();
    }

    // TODO: randomly spawn enemy-controlled armies every
    // few turns, ramping up army difficulty and freqency 
    // as the game goes on
    
    endTurn(); // this may cause recursion, not sure
}
