const SIDEBAR_WIDTH = 200;
//const SIDEBAR_START_X = canvas.width - SIDEBAR_WIDTH;
//const SIDEBAR_START_Y = MINI_MAP_HEIGHT;

var button1 = new buttonClass();
    button1.create({
	x:700,
	y:300, 
	label: "Test", 
	onClick: testButton,
    });

// editor button definitions
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

const WORLD_SIDEBAR_BUTTONS = [
    button1,
];

const EDITOR_SIDEBAR_BUTTONS = [
    terrainPrevButton,
    terrainNextButton,
];

const BATTLE_SIDEBAR_BUTTONS = [];

function drawSidebar() {
    colorRect(canvas.width-SIDEBAR_WIDTH,MINI_MAP_HEIGHT, 
	SIDEBAR_WIDTH,canvas.height, 'grey');

    if(battleMode == false && editorMode == false) {
	for(const button of WORLD_SIDEBAR_BUTTONS) {
	    button.draw();
	}
    }

    if(editorMode) {
	for(const button of EDITOR_SIDEBAR_BUTTONS) {
	    button.draw();
	}
    }

    if(battleMode) {
	for(const button of BATTLE_SIDEBAR_BUTTONS) {
	    button.draw();
	}
    }
}

function handleSidebarButtonClick(evt) {
    console.log("in handleSidebarButtonClick");
    var mousePos = calculateMousePos(evt);

    if(isClickOnButton(mousePos, button1)) {
	console.log("click is on the button");
	button1.onClick();
    }
}

function isClickOnButton(mousePos, button) {
    if(mousePos.x < button.x) {
	//console.log("click is left of button");
        return false;
    }
    if(mousePos.x > button.x + button.width) {
	//console.log("click is right of button");
        return false;
    }
    if(mousePos.y < button.y) {
	//console.log("click is above button");
        return false;
    }
    if(mousePos.y > button.y + button.height) {
	//console.log("click is below button");
        return false;
    }

    return true;

}




// sidebar grid experiment
//var sidebar btn height = 40;

// for 1-5 draw battle/world terrain appropriate to numbers
const CITY_BUTTON = 6;
const ARMY_BUTTON = 7;
const PLAYER_SWITCHER = 8;
const SEASON_SWITCHER = 9;

var editModeSidebarGrid = [
    0,0,0,0,0,
    0,8,0,9,0,
    0,0,0,0,0,
    1,2,3,4,5, // if battle edit mode, add 10 to each of these to get battle terrain codes
    0,0,0,0,0,
    0,6,7,0,0,
    0,0,0,0,0,
    0,0,0,0,0, // TODO: add resource tiles
    0,0,0,0,0,
    0,0,0,0,0,
];
