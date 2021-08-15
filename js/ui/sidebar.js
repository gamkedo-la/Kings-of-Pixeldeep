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

function handleSidebarButtonClick(mousePos) {
    console.log("in handleSidebarButtonClick");

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

