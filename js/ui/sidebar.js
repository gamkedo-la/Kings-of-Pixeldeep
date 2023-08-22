const SIDEBAR_WIDTH = 200;
//const SIDEBAR_START_X = canvas.width - SIDEBAR_WIDTH;
//const SIDEBAR_START_Y = MINI_MAP_HEIGHT;



var currentSidebarButtons = [];

function drawSidebar() {
    
    colorRect(canvas.width-SIDEBAR_WIDTH,MINI_MAP_HEIGHT,SIDEBAR_WIDTH,canvas.height, 'grey');

    // draw background
    canvasContext.drawImage(guiSideBarBackdrop,canvas.width-SIDEBAR_WIDTH,0);

    // draw all buttons
    for(const button of currentSidebarButtons) {
    	button.draw();
    }
}

function handleSidebarButtonClick(mousePos) {
    //console.log("in handleSidebarButtonClick");

    for(let i=0;i<currentSidebarButtons.length; i++) {
	let currentButton = currentSidebarButtons[i];
        if(isClickOnButton(mousePos, currentButton)) {
            // FIXME: this seems to check ALL buttons but
            // we should only check visible buttons?
            console.log("handleSidebarButtonClick is clicking "+currentButton.label);
            currentButton.onClick(); 
            break; // stop looking for more buttons, only click the first match
        }
    }
}

function isClickOnButton(mousePos, button) {
    var clickedOnButton = isClickInBox(mousePos,
	button.x, button.y,
	button.x + button.width, button.y + button.height,
    );

    if (clickedOnButton) {
        if (buttonClickSound != null) {
            buttonClickSound.play();
        }
    }   

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

    return clickedOnButton;
}

