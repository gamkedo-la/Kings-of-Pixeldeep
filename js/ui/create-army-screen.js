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
        label: "% of Population",
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

    new buttonClass({
        x: CITY_PANEL_X + CITY_PANEL_W - 350,
        y: CITY_PANEL_Y + CITY_PANEL_H - 80,
        label: "Create",
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        onClick: function() {
            if(selectedWorldEntity instanceof cityClass) {
                var viewingCity = selectedWorldEntity;
                // Index 1 is the pctOfPopulation slider object
                var pctOfPopulation = createArmyScreenControls[1]; 
                var newTroopCount = viewingCity.population;
                if(pctOfPopulation != null && pctOfPopulation.isDragging) {
                    // use the % of Population slider to determine how many army troops
                    newTroopCount *= pctOfPopulation.currentValue / 100;
                }
                newTroopCount = Math.floor(Math.max(newTroopCount, 0));
                newTroops = newArmyTroops;
                // set the number of new troops
                newTroops.peasants = newTroopCount;
                // remove new troop count from city's population
                viewingCity.population -= newTroopCount;
                viewingCity.population = Math.max(viewingCity.population, 0);
                createArmy(newTroops, viewingCity);
                showCreateArmyScreen = false;
            }
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
    let newArmy = new armyClass({
        worldCol: 7,
        worldRow: 8,
        name: "player_army_" + milisecondTimestamp,
        troops: troopList,
    });
    playerArmies.push(newArmy);
    allArmies.push(newArmy);

    // deselect the city so you can immediately click to select your army
    selectedWorldEntity = null;
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
