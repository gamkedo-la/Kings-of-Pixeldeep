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
// TODO: also, city class create code like button code for one-line creation
var venice = new cityClass();
    venice.name = "venice";
    venice.setPosition(0,0);
    playerCities.push(venice);

var paris  = new cityClass();
    paris.name = "paris";
    paris.setPosition(2,4);
    playerCities.push(paris);

var army1  = new armyClass();
    army1.setPosition(5,5);
    playerArmies.push(army1);

