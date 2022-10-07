var playerArmies = [];
var enemyArmies = [];
var allArmies = [];
var selectedArmy = null;

var playerCities = [];
var playerResources = {
    horses: 0, // possible scope cut: remove horse units?
    wood: 0,
    iron: 0,
    // wheat/food is taken care of at the city level
    // do we want any kind of "gold/crowns/money" resource?
}

var enemyCities = [];

// DEMO MAP SETUP

// TODO: new method for pre-populating maps (like racing game?)
var venice = new cityClass({
    worldCol: 0,
    worldRow: 0,
    name: "Venice",
    population: {
        total: 120,
        forestry: 10,
        wheatFields: 60,
        stables: 15,
        mines: 5,
        blacksmiths: 30,
    },
});
playerCities.push(venice);

var paris  = new cityClass({
    worldCol: 2,
    worldRow: 4,
    name: "Paris",
});
playerCities.push(paris);

var army1  = new armyClass({
    worldCol: 5,
    worldRow: 5,
    name: "My First Army",
});
playerArmies.push(army1);

var army2 = new armyClass({
    worldCol: 7,
    worldRow: 7,
    name: "Enemy Army",
    playerControlled: false,
});
enemyArmies.push(army2);

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
