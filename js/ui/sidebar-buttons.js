const WORLD_SIDEBAR_BUTTONS = [
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
            return togglePauseMode();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:625,
        y:450, 
    }),

    new buttonClass({
        label: "End Turn", 
        padding: 1,
        onClick: function() { 
            endTurn();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:625,
        y:525, 
    }),
];

const WORLD_EDITOR_SIDEBAR_BUTTONS = [
// Terrain Type Buttons
    new buttonClass({
        label: "Mtn", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = WORLD_MOUNTAINS;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_MOUNTAINS || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:210, 
        width:150,
        height:25,
        paddingPx:7
    }),
    new buttonClass({
        label: "Forest", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = WORLD_FOREST;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_FOREST || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:250, 
        width:150,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "Grass", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = WORLD_GRASS;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_GRASS || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:290, 
        width:150,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "Farm", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = WORLD_FARM;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_FARM || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:330, 
        width:150,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "Water", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = WORLD_WATER;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_WATER || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:370, 
        width:150,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "Shallows", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = WORLD_SHALLOWS;
        },
        highlightIf: function() {
            return terrainBrushCode === WORLD_SHALLOWS || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:410, 
        width:150,
        height:25,
        paddingPx:7
    }),

// Brush Size Buttons
    new buttonClass({
        label: "1x1", 
        padding: 1,
        onClick: function() {
            terrainBrushSize = 1;
        },
        highlightIf: function() {
            return terrainBrushSize === 1 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:740,
        y:210, 
        width:50,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "3x3", 
        padding: 1,
        onClick: function() {
            terrainBrushSize = 3;
        },
        highlightIf: function() {
            return terrainBrushSize === 3 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:740,
        y:250, 
        width:50,
        height:25,
        paddingPx:7
   }),

    new buttonClass({
        label: "5x5", 
        padding: 1,
        onClick: function() {
            terrainBrushSize = 5;
        },
        highlightIf: function() {
            return terrainBrushSize === 5 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:740,
        y:290, 
        width:50,
        height:25,
        paddingPx:7
    }),

// Utility Buttons

    new buttonClass({
        label: "New", 
        padding: 1,
        onClick: testButton,
        x:602,
        y:470, 
        width:50,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "Save", 
        padding: 1,
        onClick: function() {
            console.log({
            cols: level_cols,
            rows: level_rows,
            grid: levelGrid
            });
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:660,
        y:470, 
        width:50,
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
        x:730,
        y:470, 
        width:50,
        height:25,
        paddingPx:7
    }),

    new buttonClass({
        label: "Leave Editor", 
        padding: 1,
        onClick: function() {
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
        x:625,
        y:525, 
    }),
];

const BATTLE_SIDEBAR_BUTTONS = [
    new buttonClass({
        label: "Pause (P)",
        padding: 1,
        onClick: function() { 
            return togglePauseMode();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:625,
        y:450, 
    }),
    new buttonClass({
        label: "Surrender",
        padding: 1,
        onClick: function() {
            setupBattleMode(); // get a new map for next battle mode
            requestWorldMode('battle');
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:625,
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
            terrainBrushCode = BATTLE_FIELD;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_FIELD || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:210, 
        width:150,
        height:25
    }),
    new buttonClass({
        label: "Tree", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = BATTLE_TREES;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_TREES || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:245, 
        width:150,
        height:25
    }),

    new buttonClass({
        label: "Rock", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = BATTLE_ROCKS;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_ROCKS || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:280, 
        width:150,
        height:25
    }),

    new buttonClass({
        label: "Bush", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = BATTLE_BUSHES;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_BUSHES || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:315, 
        width:150,
        height:25
    }),

    new buttonClass({
        label: "Mud", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = BATTLE_MUD;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_MUD || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:350, 
        width:150,
        height:25
    }),

    new buttonClass({
        label: "Water", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = BATTLE_WATER;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_WATER || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:385, 
        width:150,
        height:25
    }),

    new buttonClass({
        label: "Shallows", 
        padding: 1,
        onClick: function() {
            terrainBrushCode = BATTLE_SHALLOWS;
        },
        highlightIf: function() {
            return terrainBrushCode === BATTLE_SHALLOWS || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:420, 
        width:150,
        height:25
    }),

// Brush Size Buttons
    new buttonClass({
        label: "1x1", 
        padding: 1,
        onClick: function() {
            terrainBrushSize = 1;
        },
        highlightIf: function() {
            return terrainBrushSize === 1 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:740,
        y:210, 
        width:150,
        height:25
    }),

    new buttonClass({
        label: "3x3", 
        padding: 1,
        onClick: function() {
            terrainBrushSize = 3;
        },
        highlightIf: function() {
            return terrainBrushSize === 3 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:740,
        y:250, 
        width:150,
        height:25
    }),

    new buttonClass({
        label: "5x5", 
        padding: 1,
        onClick: function() {
            terrainBrushSize = 5;
        },
        highlightIf: function() {
            return terrainBrushSize === 5 || isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:740,
        y:290, 
        width:150,
        height:25
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
        x:602,
        y:470, 
        width:150,
        height:25
    }),

    new buttonClass({
        label: "Save", 
        padding: 1,
        onClick: function() {
            console.log({
            cols: level_cols,
            rows: level_rows,
            grid: levelGrid
            });
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:660,
        y:470, 
        width:150,
        height:25

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
        x:730,
        y:470, 
        width:150,
        height:25
   }),

    new buttonClass({
        label: "Leave Editor", 
        padding: 1,
        onClick: function() {
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
        x:620,
        y:550, 
        width:150,
        height:25
    }),
];

const WORLD_PAUSE_SIDEBAR_BUTTONS = [
    new buttonClass({
        label: "Game Options (stub)",
        padding: 1,
        onClick: function() {
            // Add game options functionality request here
        },
        highlightIf: function() {
            return false;
            // Once no longer a stub for a game options menu, uncomment the highlight functionality
            // return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:625,
        y:450, 
    }),

    new buttonClass({
        label: "Edit World Map",
        padding: 1,
        onClick: function() {
            requestEditorMode('world');
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:625,
        y:525, 
   }),

    new buttonClass({
        label: "Unpause (P)",
        padding: 1,
        onClick: function() { 
            return togglePauseMode();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:625,
        y:375, 
    }),
];

const BATTLE_PAUSE_SIDEBAR_BUTTONS = [
    new buttonClass({
        label: "Game Options (stub)",
        padding: 1,
        onClick: function() {
            // Add game options functionality request here
        },
        highlightIf: function() {
            return false;
            // Once no longer a stub for a game options menu, uncomment the highlight functionality
            // return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:470, 
    }),
    new buttonClass({
        label: "Edit Battle Map",
        padding: 1,
        onClick: function() {
            requestEditorMode('battle');
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:470, 
    }),
    new buttonClass({
        label: "Unpause (P)",
        padding: 1,
        onClick: function() {
            return togglePauseMode();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:605,
        y:310, 
    }),
    new buttonClass({
        label: "Surrender",
        padding: 1,
        onClick: function() {
            setupBattleMode(); // get a new map for next battle mode
            requestWorldMode('battle');
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:625,
        y:525, 
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
