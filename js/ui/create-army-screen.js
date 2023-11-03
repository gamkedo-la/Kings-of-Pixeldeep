const CREATE_ARMY_SCREEN_X = 100;
const CREATE_ARMY_SCREEN_Y = 150;
const CREATE_ARMY_SCREEN_W = 400;
const CREATE_ARMY_SCREEN_H = 400;
const CREATE_ARMY_MIN_RECRUIT_PCT = 0;
const CREATE_ARMY_MAX_RECRUIT_PCT = 90;

var showCreateArmyScreen = false;

var newArmyTroops = {
    peasants: 50,
};

var newArmyTroopCost = {
    peasants: 1,
};

var newTroopCount = function() {
    var newTroopCount = 0;
    if(selectedWorldEntity instanceof cityClass) {
        var viewingCity = selectedWorldEntity;
        // Index 1 is the pctOfPopulation slider object
        var pctOfPopulation = createArmyScreenControls[1]; 
        newTroopCount = viewingCity.population;
        if(pctOfPopulation != null) {
            // use the % of Population slider to determine how many army troops
            newTroopCount *= pctOfPopulation.currentValue / 100;
        }
        newTroopCount = Math.floor(Math.max(newTroopCount, 0));
    }
    return newTroopCount;
}

var newArmyCost = function() {
    var troopCount = newTroopCount();
    var cost = newArmyTroopCost.peasants * troopCount;
    return cost;
}

var createArmyScreenControls = [
    new buttonClass({
        x: CREATE_ARMY_SCREEN_X + 125,
        y: CREATE_ARMY_SCREEN_Y + 0,
        color: 'lightgrey',
        label: "Create An Army",
    }),

    new sliderClass({
        x: CREATE_ARMY_SCREEN_X + 25,
        y: CREATE_ARMY_SCREEN_Y + 75,
        showValue: true,
        maxValue: 90,
        currentValue: 25,
        label: "% Pop.",
    }),

    new buttonClass({
        x: CREATE_ARMY_SCREEN_X + 25,
        y: CREATE_ARMY_SCREEN_Y + 110,
        label: "Min",
        color: "wheat",
        textcolor: "blue",
        width: 45,
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        onClick: function() {
            createArmyScreenControls[1].currentValue = CREATE_ARMY_MIN_RECRUIT_PCT;
        },
    }),

    new buttonClass({
        x: CREATE_ARMY_SCREEN_X + 80,
        y: CREATE_ARMY_SCREEN_Y + 110,
        label: "-",
        color: "wheat",
        textcolor: "blue",
        width: 45,
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        onClick: function() {
            createArmyScreenControls[1].currentValue -= 1;
            createArmyScreenControls[1].currentValue = 
                Math.max(createArmyScreenControls[1].currentValue, CREATE_ARMY_MIN_RECRUIT_PCT);
        },
    }),

    new buttonClass({
        x: CREATE_ARMY_SCREEN_X + 125,
        y: CREATE_ARMY_SCREEN_Y + 110,
        label: "+",
        color: "wheat",
        textcolor: "blue",
        width: 45,
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        onClick: function() {
            createArmyScreenControls[1].currentValue += 1;
            createArmyScreenControls[1].currentValue = 
                Math.min(createArmyScreenControls[1].currentValue, CREATE_ARMY_MAX_RECRUIT_PCT);
        },
    }),

    new buttonClass({
        x: CREATE_ARMY_SCREEN_X + 180,
        y: CREATE_ARMY_SCREEN_Y + 110,
        label: "Max",
        color: "wheat",
        textcolor: "blue",
        width: 45,
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        onClick: function() {
            createArmyScreenControls[1].currentValue = CREATE_ARMY_MAX_RECRUIT_PCT;
        },
    }),

    /* Create Army button */
    new buttonClass({
        x: CITY_PANEL_X + CITY_PANEL_W - 350,
        y: CITY_PANEL_Y + CITY_PANEL_H - 80,
        label: function() {
            var armyCost = newArmyCost();
            return "Create (" + armyCost + "g)";
        },
        color: function() {
            var armyCost = newArmyCost();
            var newColor = BUTTON_CLASS_COLOR_FAINT_WHITE;
            return newColor;
        },
        highlightIf: function() {
            var armyCost = newArmyCost();
            var hoverHighlight = false;
            if (playerGold >= armyCost && armyCost > 0) {
                var hoverHighlight = isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
            }
            return hoverHighlight;
        },
        onClick: function() {
            let armyCost = newArmyCost();
            let armyTroopCount = newTroopCount();
            if(selectedWorldEntity instanceof cityClass && playerGold >= armyCost && armyCost > 0) {
                viewingCity = selectedWorldEntity;
                // copy newArmyTroops structure and reset to army troop count
                var newTroops = structuredClone(newArmyTroopCost);
                newTroops.peasants = armyTroopCount;
                // remove new troop count from city's population
                createArmy(newTroops);
                viewingCity.population -= armyTroopCount;
                viewingCity.population = Math.max(viewingCity.population, 0);
                // remove the armyCost from player's gold
                playerGold -= armyCost;
                showCreateArmyScreen = false;
            }
        },
        textColor: function() {
            var armyCost = newArmyCost();
            var newTextColor = "black";
            if (playerGold < armyCost || armyCost === 0) {
                newTextColor = "grey";
            }
            return newTextColor;
        },
    }),

    new buttonClass({
        x: CITY_PANEL_X + CITY_PANEL_W - 170,
        y: CITY_PANEL_Y + CITY_PANEL_H - 80,
        label: "Close",
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        onClick: function() {
            showCreateArmyScreen = false;
        },
    }),
];

function drawCreateArmyScreen() {
    colorRect(CREATE_ARMY_SCREEN_X,CREATE_ARMY_SCREEN_Y, 
        CREATE_ARMY_SCREEN_W,CREATE_ARMY_SCREEN_H, 
        'lightgrey'); 

    for(var i=0;i<createArmyScreenControls.length;i++) {
        createArmyScreenControls[i].draw();
    }
}

function createArmy(troopList) {
    let milisecondTimestamp = Date.now();

    // get selected city for coordinates

    let cityWorldCol = selectedWorldEntity.worldCol;
    let cityWorldRow = selectedWorldEntity.worldRow;

    // search around the selected city tiles clockwise to find an open one
    let options = [
        { x: -1, y: 0},
        { x: -1, y: -1},
        { x: 0, y: -1},
        { x: 1, y: -1},
        { x: 1, y: 0},
        { x: 1, y: 1},
        { x: 0, y: 1},
        { x: -1, y: 1},
        { x: 0, y: 0 },
    ];

    // default to city index just in case city is surrounded, as long as we can
    // click the new army and move them out of the city
    let selectedOffset = options[0];
    for(const option of options) {
        let outskirts = { col: cityWorldCol + option.x, row: cityWorldRow + option.y };
        // avoid placing new army on any type of existing army: player or enemy
        if(!isPlayerArmyAtPosition(outskirts.col, outskirts.row) &&
            !isEnemyArmyAtPosition(outskirts.col, outskirts.row)
        ) {
            selectedOffset = option;
            break;
        }
    }

    let newArmy = new armyClass({
        worldCol: cityWorldCol + selectedOffset.x,
        worldRow: cityWorldRow + selectedOffset.y,
        name: "player_army_" + milisecondTimestamp,
        troops: troopList,
    });
    playerArmies.push(newArmy);
    allArmies.push(newArmy);

    // deselect the city so you can immediately click to select your army
    deselectWorldEntity();
}

function handleCreateArmyScreenMousemove(mousePos) {
    for(let i=0;i<createArmyScreenControls.length;i++) {
        let currentButton = createArmyScreenControls[i];
        if(currentButton instanceof sliderClass) {
            // slider mousemoveHandler does the isDragging check,
            // so is safe to call whenever mouse is moving in create army panel
            currentButton.mousemoveHandler(mousePos);
        }  
    }
}

function handleCreateArmyScreenMouseup(mousePos) {
    for(let i=0;i<createArmyScreenControls.length;i++) {
        let currentButton = createArmyScreenControls[i];

        if(isClickOnButton(mousePos, currentButton)) {
            if(currentButton instanceof sliderClass) {
                currentButton.mouseupHandler(mousePos);
            } else {
                currentButton.onClick();
            }
            break;
        }
    }
}

function handleCreateArmyScreenMousedown(mousePos) {
    for(let i=0;i<createArmyScreenControls.length;i++) {
        let currentButton = createArmyScreenControls[i];

        if(isClickOnButton(mousePos, currentButton)) {
            if(currentButton instanceof sliderClass) {
                currentButton.mousedownHandler(mousePos);
            }
        }
    }
}
