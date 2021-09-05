var button1 = new buttonClass();
    button1.create({
	x:700,
	y:300, 
	label: "Test", 
	onClick: testButton,
    });

// == world editor button definitions ==

// terrain buttons
var mtnButton = new buttonClass();
    mtnButton.create({
	x:605,
	y:210, 
	label: "Mtn", 
	onClick: testButton,
    });

var forestButton = new buttonClass();
    forestButton.create({
	x:605,
	y:250, 
	label: "Forest", 
	onClick: testButton,
    });

var grassButton = new buttonClass();
    grassButton.create({
	x:605,
	y:290, 
	label: "Grass", 
	onClick: testButton,
    });

var farmButton = new buttonClass();
    farmButton.create({
	x:605,
	y:330, 
	label: "Farm", 
	onClick: testButton,
    });

var waterButton = new buttonClass();
    waterButton.create({
	x:605,
	y:370, 
	label: "Water", 
	onClick: testButton,
    });

// brush size buttons
var brushButton1 = new buttonClass();
    brushButton1.create({
	x:740,
	y:210, 
	label: "1x1", 
	onClick: testButton,
    });

var brushButton3 = new buttonClass();
    brushButton3.create({
	x:740,
	y:250, 
	label: "3x3", 
	onClick: testButton,
    });

var brushButton5 = new buttonClass();
    brushButton5.create({
	x:740,
	y:290, 
	label: "5x5", 
	onClick: testButton,
    });

// utility buttons

var newButton = new buttonClass();
    newButton.create({
	x:602,
	y:450, 
	label: "New", 
	onClick: testButton,
    });

var saveButton = new buttonClass();
    saveButton.create({
	x:660,
	y:450, 
	label: "Save", 
	onClick: testButton,
    });

var loadButton = new buttonClass();
    loadButton.create({
	x:730,
	y:450, 
	label: "Load", 
	onClick: testButton,
    });

var exitEditorButton = new buttonClass();
    exitEditorButton.create({
	x:620,
	y:500, 
	label: "Leave Editor", 
	onClick: testButton,
    });
/*
const WORLD_MOUNTAINS = 1;
const WORLD_FOREST = 2;
const WORLD_GRASS = 3;
const WORLD_FARM = 4;
const WORLD_WATER = 5;
*/
/*
var terrainPrevButton = new buttonClass();
terrainPrevButton.create({
    x: 610,
    y: 220,
    label: "Prev",
    onClick: testButton,

});

var terrainNextButton = new buttonClass();
terrainNextButton.create({
    x: 720,
    y: 220,
    label: "Next",
    onClick: testButton,

});
*/

const WORLD_SIDEBAR_BUTTONS = [
    button1,
];

const WORLD_EDITOR_SIDEBAR_BUTTONS = [
    mtnButton,
    forestButton,
    grassButton,
    farmButton,
    waterButton,

    brushButton1,
    brushButton3,
    brushButton5,

    newButton,
    saveButton,
    loadButton,

    exitEditorButton,
];

const BATTLE_SIDEBAR_BUTTONS = [
    //
];

const BATTLE_EDITOR_SIDEBAR_BUTTONS = [
    //
];
