const CREATE_ARMY_SCREEN_X = 100;
const CREATE_ARMY_SCREEN_Y = 150;
const CREATE_ARMY_SCREEN_W = 400;
const CREATE_ARMY_SCREEN_H = 400;

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

    new buttonClass({
        x: CITY_PANEL_X + CITY_PANEL_W - 350,
        y: CITY_PANEL_Y + CITY_PANEL_H - 80,
        label: "Create",
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        onClick: function() {
            createArmy(newArmyTroops, selectedWorldEntity);
            showCreateArmyScreen = false;
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

function handleCreateArmyScreenMouseup(mousePos) {
    for(let i=0;i<createArmyScreenControls.length;i++) {
        let currentButton = createArmyScreenControls[i];

        if(isClickOnButton(mousePos, currentButton)) {
            currentButton.onClick();
            break;
        }
    }
}