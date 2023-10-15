const LABEL_X = 550; // left column of all large sidebar labels

const MOVEMENT_POINTS = "Movement points: ";
const SELECTED_UNITS = "Selected units: ";

const movementPointsLabel = 
    new labelClass({
        text: MOVEMENT_POINTS + " 0",
        x: LABEL_X,
        y: 200,
    })

const WORLD_SIDEBAR_LABELS = [
    movementPointsLabel,
];

const selectedUnitCountLabel = 
    new labelClass({
        text: SELECTED_UNITS + " 0",
        x: LABEL_X,
        y: 200,
    })

const BATTLE_SIDEBAR_LABELS = [
    selectedUnitCountLabel,
];

