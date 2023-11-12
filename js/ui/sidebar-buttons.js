const BUTTON_X = 625; // left column of all large sidebar buttons

// the world editor buttons are smaller
const EDIT_BUTTON_X = 610;
const EDIT_BUTTON_W = 120;
const EDIT_BUTTON_H = 25;
const EDIT_BUTTON_P = 6; // top padding

const MINI_BUTTON_W = 50;
const SIZE_BUTTON_X = 740;

const WORLD_SIDEBAR_BUTTONS = [
    new buttonClass({
        label: "Help",
        padding: 1,
        onClick: function() {
            console.log("help button clicked!");
            let div = document.getElementById('helpwindow');
            if (div) div.style.display = "block";
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:300, 
    }),
    /*
    new buttonClass({
        x:600,
        y:200, 
        label: function () {
            var nearestCity = { name: "paris" };
            return nearestCity.name.toUpperCase();
        }, 
        width: 200,
        onClick: function () { },
        color: 'darkgray',
        textColor: 'white',
    }),
    new buttonClass({
        x:605,
        y:310, 
        label: function () {
            var foodChange = 3;
            return "Food " + printWithSign(foodChange);
        }, 
        width: 60,
        onClick: testButton,
        color: 'gray',
        textColor: 'yellow',
    }),
    new buttonClass({
        label: "Slider Test", 
        onClick: function() { 
            showSliderTest = !showSliderTest;
        },
        x:622,
        y:400, 
    }),
    */
    new buttonClass({
        label: "Pause (P)",
        padding: 1,
        onClick: function() { 
            console.log("button clicked: "+this.label);
            return togglePauseMode();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:375, 
    }),

    new buttonClass({
        label: "Next (Tab)",
        onClick: function() { 
            console.log("button clicked: "+this.label);
            selectNextAvailableArmy();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:450, 
    }),

    new buttonClass({
        label: "End Turn", 
        padding: 1,
        onClick: function() { 
            console.log("button clicked: "+this.label);
            endTurn();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:525, 
    }),
];

const endTurnButton = WORLD_SIDEBAR_BUTTONS[WORLD_SIDEBAR_BUTTONS.length - 1];

const WORLD_EDITOR_SIDEBAR_BUTTONS = [
// Terrain Type Buttons
    new buttonClass({
        label: "Mtn", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = WORLD_MOUNTAINS;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_MOUNTAINS || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:210, 
        width:150,
        height:25,
        paddingPx:7
    }),
    new buttonClass({
        label: "Forest", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = WORLD_FOREST;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_FOREST || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:250, 
        width:150,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "Grass", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = WORLD_GRASS;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_GRASS || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:290, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),

    new buttonClass({
        label: "Farm", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = WORLD_FARM;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_FARM || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:330, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),

    new buttonClass({
        label: "Water", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = WORLD_WATER;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_WATER || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:370, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),

    new buttonClass({
        label: "Shallows", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = WORLD_SHALLOWS;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_SHALLOWS || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:410, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),

// Brush Size Buttons
    new buttonClass({
        label: "1x1", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushSize = 1;
        },
        highlightIf: function() {
            return terrainBrushSize === 1 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:SIZE_BUTTON_X,
        y:210, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "3x3", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushSize = 3;
        },
        highlightIf: function() {
            return terrainBrushSize === 3 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:SIZE_BUTTON_X,
        y:250, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:7
   }),

    new buttonClass({
        label: "5x5", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushSize = 5;
        },
        highlightIf: function() {
            return terrainBrushSize === 5 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:SIZE_BUTTON_X,
        y:290, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:7
    }),

// Utility Buttons

    new buttonClass({
        label: "New", 
        padding: 1,
        onClick: testButton,
        x:EDIT_BUTTON_X,
        y:470, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "Save", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            console.log({
            cols: level_cols,
            rows: level_rows,
            grid: levelGrid
            });
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X+60,
        y:470, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "Load", 
        padding: 1,
        onClick: testButton,
        highlightIf: function() {
            return false;
            // Once no longer a stub for a game options menu, uncomment the highlight functionality
            // return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X+60+60,
        y:470, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "Leave Editor", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            editorMode = false;
            if (pauseMode) {
                setupPauseMode('world');
            } else {
                setupWorldMode();
            }
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:525, 
    }),
];

const BATTLE_SIDEBAR_BUTTONS = [
    new buttonClass({
        label: "Help",
        padding: 1,
        onClick: function() {
            console.log("help button clicked!");
            let div = document.getElementById('helpwindow');
            if (div) div.style.display = "block";
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:375, 
    }),
    new buttonClass({
        label: "Pause (P)",
        padding: 1,
        onClick: function() { 
            console.log("button clicked: "+this.label);
            return togglePauseMode();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:450, 
    }),
    new buttonClass({
        label: "Surrender",
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            handlePlayerBattleSurrender();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:525, 
    }),
    //
    //new buttonClass({
    //    label: "End Turn", 
    //    onClick: function() { 
    //        console.log("clicked end turn");
    //        playerTurn = !playerTurn;
    //        enemyTurn = !enemyTurn;
    //    },
    //    x:642,
    //    y:550, 
    //}),
];

const BATTLE_EDITOR_SIDEBAR_BUTTONS = [
// Terrain Type Buttons
    new buttonClass({
        label: "Grass", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = BATTLE_FIELD;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_FIELD || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:210, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),
    new buttonClass({
        label: "Tree", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = BATTLE_TREES;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_TREES || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:245, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),

    new buttonClass({
        label: "Rock", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = BATTLE_ROCKS;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_ROCKS || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:280, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),

    new buttonClass({
        label: "Bush", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = BATTLE_BUSHES;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_BUSHES || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:315, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),

    new buttonClass({
        label: "Mud", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = BATTLE_MUD;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_MUD || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:350, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),

    new buttonClass({
        label: "Water", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = BATTLE_WATER;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_WATER || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:385, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),

    new buttonClass({
        label: "Shallows", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushCode = BATTLE_SHALLOWS;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_SHALLOWS || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:420, 
        width:EDIT_BUTTON_W,
        height:EDIT_BUTTON_H,
        paddingPx:EDIT_BUTTON_P
    }),

// Brush Size Buttons
    new buttonClass({
        label: "1x1", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushSize = 1;
        },
        highlightIf: function() {
            return terrainBrushSize === 1 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:SIZE_BUTTON_X,
        y:210, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:6
    }),

    new buttonClass({
        label: "3x3", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushSize = 3;
        },
        highlightIf: function() {
            return terrainBrushSize === 3 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:SIZE_BUTTON_X,
        y:250, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:6
    }),

    new buttonClass({
        label: "5x5", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            terrainBrushSize = 5;
        },
        highlightIf: function() {
            return terrainBrushSize === 5 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:SIZE_BUTTON_X,
        y:290, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:6
    }),

// Utility Buttons

    new buttonClass({
        label: "New", 
        padding: 1,
        onClick: testButton,
        highlightIf: function() {
            return false;
            // Once no longer a stub for a game options menu, uncomment the highlight functionality
            // return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X,
        y:470, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:6
    }),

    new buttonClass({
        label: "Save", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            console.log({
            cols: level_cols,
            rows: level_rows,
            grid: levelGrid
            });
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X+60,
        y:470, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:6

    }),

    new buttonClass({
        label: "Load", 
        padding: 1,
        onClick: testButton,
        highlightIf: function() {
            return false;
            // Once no longer a stub for a game options menu, uncomment the highlight functionality
            // return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:EDIT_BUTTON_X+60+60,
        y:470, 
        width:MINI_BUTTON_W,
        height:25,
        paddingPx:6
   }),

    new buttonClass({
        label: "Leave Editor", 
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            editorMode = false;
            if (pauseMode) {
                setupPauseMode('battle');
            } else {
                resumeBattleMode();
            }
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:525, 
    }),
];

const WORLD_PAUSE_SIDEBAR_BUTTONS = [

    new buttonClass({
        label: "Help",
        padding: 1,
        onClick: function() {
            console.log("help button clicked!");
            let div = document.getElementById('helpwindow');
            if (div) div.style.display = "block";
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:525, 
    }),

    new buttonClass({
        label: "Game Options",
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            // Add game options functionality request here
        },
        highlightIf: function() {
            return false;
            // Once no longer a stub for a game options menu, uncomment the highlight functionality
            // return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:450, 
    }),

    new buttonClass({
        label: "Edit Map",
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            requestEditorMode('world');
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:300, 
   }),

    new buttonClass({
        label: "Unpause (P)",
        padding: 1,
        onClick: function() { 
            console.log("button clicked: "+this.label);
            return togglePauseMode();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:375, 
    }),
];

const BATTLE_PAUSE_SIDEBAR_BUTTONS = [
    new buttonClass({
        label: "Game Options",
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            // Add game options functionality request here
        },
        highlightIf: function() {
            return false;
            // Once no longer a stub for a game options menu, uncomment the highlight functionality
            // return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:460, 
    }),
    new buttonClass({
        label: "Edit Map",
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            requestEditorMode('battle');
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:395, 
    }),
    new buttonClass({
        label: "Unpause (P)",
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            return togglePauseMode();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:330, 
    }),
    new buttonClass({
        label: "Surrender",
        padding: 1,
        onClick: function() {
            console.log("button clicked: "+this.label);
            handlePlayerBattleSurrender();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:525, 
    }),
    new buttonClass({
        label: "Help",
        padding: 1,
        onClick: function() {
            console.log("help button clicked!");
            let div = document.getElementById('helpwindow');
            if (div) div.style.display = "block";
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:BUTTON_X,
        y:265, 
    }),

];

const CITY_SIDEBAR_BUTTONS = [
    new buttonClass({
        label: "Create Army",
        onClick: function() {
            showCreateArmyScreen = true;
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x: BUTTON_X,
        y: 500,
    }),
];

function printWithSign(number) {
    if(number > 0) {
        return "+"+ number;
    } else {
        return number;
        //return "-"+ Math.abs(number); 
    }
}

function selectedCityPopulation() {
    let population = 0;
    let city = null;
    city = selectedCity();
    if (city !== null) {
        population = city.population;
    }
    return population;
}

function selectedCity() {
    let selectedCity = null;
    if(selectedWorldEntity instanceof cityClass) {
        selectedCity = selectedWorldEntity;
    }
    return selectedCity;
}

function updateWorldEntitySidebarButtons(selectedWorldEntity) {
    currentSidebarButtons = WORLD_SIDEBAR_BUTTONS;

    if (selectedWorldEntity instanceof cityClass) {
        currentSidebarButtons = CITY_SIDEBAR_BUTTONS;
    }
}

// used by index.html help window close button
function closehelpwindow() {
    let div = document.getElementById('helpwindow');
    if (div) div.style.display = "none";
}
function closecreditswindow() {
    let div = document.getElementById('creditswindow');
    if (div) div.style.display = "none";
}
