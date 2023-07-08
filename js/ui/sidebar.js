const SIDEBAR_WIDTH = 200;
//const SIDEBAR_START_X = canvas.width - SIDEBAR_WIDTH;
//const SIDEBAR_START_Y = MINI_MAP_HEIGHT;



var currentSidebarButtons = [];

function drawSidebar() {
    colorRect(canvas.width-SIDEBAR_WIDTH,MINI_MAP_HEIGHT, 
	SIDEBAR_WIDTH,canvas.height, 'grey');

    for(const button of currentSidebarButtons) {
	button.draw();
    }
    /*
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
    */
    if(battleMode) {
        for(const button of BATTLE_SIDEBAR_BUTTONS) {
            button.draw();
        }
    }
}

function handleSidebarButtonClick(mousePos) {
    //console.log("in handleSidebarButtonClick");

    for(let i=0;i<currentSidebarButtons.length; i++) {
	let currentButton = currentSidebarButtons[i];
	if(isClickOnButton(mousePos, currentButton)) {
	    currentButton.onClick();
	}
    }
}

function isClickOnButton(mousePos, button) {

    return isClickInBox(mousePos,
	button.x, button.y,
	button.x + button.width, button.y + button.height,
    );
    /*
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
    */


}

