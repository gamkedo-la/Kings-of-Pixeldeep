var MainMenuButtons = [
    new buttonClass({
        label: "Play",
        padding: 1,
        onClick: function() { 
            hitPlayButton();
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x: canvas.width/2 - 150/2,
        y: 300, 
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
        x:canvas.width/2 - 150/2,
        y:400, 
    }),
    new buttonClass({
        label: "Credits",
        padding: 1,
        onClick: function() { 
            console.log("button clicked: "+this.label);
            let div = document.getElementById('creditswindow');
            if (div) div.style.display = "block";
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x: canvas.width/2 - 150/2,
        y: 500, 
    }),
];

function drawMainMenu() {

    //colorRect(0,0, canvas.width,canvas.height, 'grey');
    //drawText(24, 'black', 'center', "Kings Of Pixeldeep", canvas.width/2, 10);

    canvasContext.drawImage(titlescreenPic,0,0);

    if(userHasInteractedWithGame) {
        for (const button of MainMenuButtons) {
            button.draw();
        }
    } else {
        drawText(16,"black","center","Click anywhere to begin...", canvas.width/2+1, canvas.height+1 - 100);
        drawText(16,"white","center","Click anywhere to begin...", canvas.width/2, canvas.height - 100);
    }
}

var ignoreNextMouseUp = true; // ensure first click cannot click a main menu button accidentally

function handleMainMenuClick(mousePos) {

    console.log("handleMainMenuClick");
    
    // bugfix: this avoids duplicate clicks:
    // once on "click anywhere to begin",
    // AND this button in the same click
    if (ignoreNextMouseUp) {
        ignoreNextMouseUp = false;
        return;
    }
    // hmm no effect:
    if (!userHasInteractedWithGame) return; 
    if (userInteractStage === USER_INTERACT_STAGE_NONE) return;
    
    for(let i=0;i<MainMenuButtons.length; i++) {
	let currentButton = MainMenuButtons[i];
        if(isClickOnButton(mousePos, currentButton)) {
            currentButton.onClick(); 
            break; // stop looking for more buttons, only click the first match
        }
    }
}

function hitPlayButton() {
    startNewGame(world1);
    setupWorldMode();
}
