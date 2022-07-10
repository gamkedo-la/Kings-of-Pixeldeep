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

var army1  = new armyClass();
    army1.setPosition(5,5);
    playerArmies.push(army1);

