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
        label: "End Turn", 
        onClick: function() { 
            console.log("clicked end turn");
            playerTurn = !playerTurn;
            enemyTurn = !enemyTurn;
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x:642,
        y:550, 
    }),
];

const WORLD_EDITOR_SIDEBAR_BUTTONS = [
// Terrain Type Buttons
    new buttonClass({
        label: "Mtn", 
        onClick: function() {
            terrainBrushCode = 1;
        },
        highlightIf: function() {
            return terrainBrushCode === 1;
        },
        x:605,
        y:210, 
    }),
    new buttonClass({
        label: "Forest", 
        onClick: function() {
            terrainBrushCode = 2;
        },
        highlightIf: function() {
            return terrainBrushCode === 2;
        },
        x:605,
        y:250, 
    }),

    new buttonClass({
        label: "Grass", 
        onClick: function() {
            terrainBrushCode = 3;
        },
        highlightIf: function() {
            return terrainBrushCode === 3;
        },
        x:605,
        y:290, 
    }),

    new buttonClass({
        label: "Farm", 
        onClick: function() {
            terrainBrushCode = 4;
        },
        highlightIf: function() {
            return terrainBrushCode === 4;
        },
        x:605,
        y:330, 
    }),

    new buttonClass({
        label: "Water", 
        onClick: function() {
            terrainBrushCode = 5;
        },
        highlightIf: function() {
            return terrainBrushCode === 5;
        },
        x:605,
        y:370, 
    }),

    new buttonClass({
        label: "Shallows", 
        onClick: function() {
            terrainBrushCode = 6;
        },
        highlightIf: function() {
            return terrainBrushCode === 6;
        },
        x:605,
        y:410, 
    }),

// Brush Size Buttons
    new buttonClass({
        label: "1x1", 
        onClick: function() {
            terrainBrushSize = 1;
        },
        highlightIf: function() {
            return terrainBrushSize === 1;
        },
        x:740,
        y:210, 
    }),

    new buttonClass({
        label: "3x3", 
        onClick: function() {
            terrainBrushSize = 3;
        },
        highlightIf: function() {
            return terrainBrushSize === 3;
        },
        x:740,
        y:250, 
    }),

    new buttonClass({
        label: "5x5", 
        onClick: function() {
            terrainBrushSize = 5;
        },
        highlightIf: function() {
            return terrainBrushSize === 5;
        },
        x:740,
        y:290, 
    }),

// Utility Buttons

    new buttonClass({
        label: "New", 
        onClick: testButton,
        x:602,
        y:470, 
    }),

    new buttonClass({
        label: "Save", 
        onClick: function() {
            console.log({
            cols: level_cols,
            rows: level_rows,
            grid: levelGrid
            });
        },
        x:660,
        y:470, 
    }),

    new buttonClass({
        label: "Load", 
        onClick: testButton,
        x:730,
        y:470, 
    }),

    new buttonClass({
        label: "Leave Editor", 
        onClick: function() {
            setupWorldMode();
        },
        x:620,
        y:520, 
    }),
];

const BATTLE_SIDEBAR_BUTTONS = [
    //
    new buttonClass({
        label: "End Turn", 
        onClick: function() { 
            console.log("clicked end turn");
            playerTurn = !playerTurn;
            enemyTurn = !enemyTurn;
        },
        x:642,
        y:550, 
    }),
];

const BATTLE_EDITOR_SIDEBAR_BUTTONS = [
    //
];

function printWithSign(number) {
    if(number > 0) {
        return "+"+ number;
    } else {
        return number;
        //return "-"+ Math.abs(number); 
    }
}

