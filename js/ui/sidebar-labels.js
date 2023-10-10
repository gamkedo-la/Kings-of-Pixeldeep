const LABEL_X = 550; // left column of all large sidebar labels

const BATTLE_SIDEBAR_LABELS = [
    new labelClass({
        text: "Selected units: 0",
        x: LABEL_X,
        y: 200,
    })
];
    // new buttonClass({
    //     label: "Pause (P)",
    //     padding: 1,
    //     onClick: function() { 
    //         console.log("button clicked: "+this.label);
    //         return togglePauseMode();
    //     },
    //     highlightIf: function() {
    //         return isClickInBox(currentMousePos,this.x,this.y,this.x+this.width,this.y+this.height);
    //     },
    //     x:BUTTON_X,
    //     y:450, 
    // }),
