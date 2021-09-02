var button1 = new buttonClass();
    button1.create({
	x:700,
	y:300, 
	label: "Test", 
	onClick: testButton,
    });

// editor button definitions
var mtnButton= new buttonClass();
    mtnButton.create({
	x:610,
	y:300, 
	label: "Mtn", 
	onClick: testButton,
    });

var forestButton= new buttonClass();
    forestButton.create({
	x:610,
	y:350, 
	label: "Forest", 
	onClick: testButton,
    });

var grassButton= new buttonClass();
    grassButton.create({
	x:610,
	y:400, 
	label: "Grass", 
	onClick: testButton,
    });

var farmButton= new buttonClass();
    farmButton.create({
	x:610,
	y:450, 
	label: "Farm", 
	onClick: testButton,
    });

var waterButton= new buttonClass();
    waterButton.create({
	x:610,
	y:500, 
	label: "Water", 
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
    /*
    terrainPrevButton,
    terrainNextButton,
    */
];

const BATTLE_SIDEBAR_BUTTONS = [
    //
];

const BATTLE_EDITOR_SIDEBAR_BUTTONS = [
    //
];
