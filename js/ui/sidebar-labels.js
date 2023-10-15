const LABEL_X = 600; // left column of all large sidebar labels

const SELECTED_WORLD_ENTITY = "Selected: ";
const MOVEMENT_POINTS = "Movement points: ";
const SELECTED_UNITS = "Selected units: ";

const selectedWorldEntityLabel = 
    new labelClass({
        text: " ",
        width: 200, 
        x: LABEL_X,
        y: 200,
    })

const movementPointsLabel = 
    new labelClass({
        text: MOVEMENT_POINTS + " 0",
        width: 200, 
        x: LABEL_X,
        y: 224,
    })

const WORLD_SIDEBAR_LABELS = [
    selectedWorldEntityLabel,
    movementPointsLabel,
];

const selectedUnitCountLabel = 
    new labelClass({
        text: SELECTED_UNITS + " 0",
        width: 200,
        x: LABEL_X,
        y: 200,
    })

const BATTLE_SIDEBAR_LABELS = [
    selectedUnitCountLabel,
];

