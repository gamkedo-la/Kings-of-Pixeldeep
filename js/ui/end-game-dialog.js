const END_GAME_DIALOG_SCREEN_X = 100;
const END_GAME_DIALOG_SCREEN_Y = 150;
const END_GAME_DIALOG_SCREEN_W = 400;
const END_GAME_DIALOG_SCREEN_H = 400;

var showEndGameDialogScreen = false;

var endGameDialogScreenControls = [
    new buttonClass({
        x: END_GAME_DIALOG_SCREEN_X + 125,
        y: END_GAME_DIALOG_SCREEN_Y + 0,
        color: 'lightgrey',
        label: () => {

            if(winner === 'player') {
                return "Player Wins!";
            }
            if(winner === 'enemy') {
                return "Enemy Wins!";
            }
        },
    }),

    new buttonClass({
        x: END_GAME_DIALOG_SCREEN_X + END_GAME_DIALOG_SCREEN_W - 350,
        y: END_GAME_DIALOG_SCREEN_Y + END_GAME_DIALOG_SCREEN_H - 80,
        label: "Main Menu",
        highlightIf: function() {
            return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
        },
        onClick: function() {
            showEndGameDialogScreen = false;
            startMainMenuMode();
        },
    }),
];

function drawEndGameDialogScreen() {
    colorRect(END_GAME_DIALOG_SCREEN_X,END_GAME_DIALOG_SCREEN_Y, 
        END_GAME_DIALOG_SCREEN_W,END_GAME_DIALOG_SCREEN_H, 
        'lightgrey'); 

    for(var i=0;i<endGameDialogScreenControls.length;i++) {
        endGameDialogScreenControls[i].draw();
    }
}

function handleEndGameDialogScreenMouseup(mousePos) {
    for(let i=0;i<endGameDialogScreenControls.length;i++) {
        let currentButton = endGameDialogScreenControls[i];

        if(isClickOnButton(mousePos, currentButton)) {
            currentButton.onClick();
            break;
        }
    }
}
