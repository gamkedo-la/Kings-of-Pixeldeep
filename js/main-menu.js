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
        label: "Credits",
        padding: 1,
        onClick: function() { 
            console.log("button clicked: "+this.label);
        },
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        x: canvas.width/2 - 150/2,
        y: 400, 
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

function handleMainMenuClick(mousePos) {

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
