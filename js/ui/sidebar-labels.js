const LABEL_X = 550; // left column of all large sidebar labels
const SELECTED_UNITS = "Selected units: ";

const selectedUnitCountLabel = 
    new labelClass({
        text: SELECTED_UNITS + " 0",
        x: LABEL_X,
        y: 200,
    })

const BATTLE_SIDEBAR_LABELS = [
    selectedUnitCountLabel,
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
