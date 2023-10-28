const LABEL_X = 600; // left column of all large sidebar labels

const SELECTED_WORLD_ENTITY = "Selected: ";
const MOVEMENT_POINTS = "Movement points: ";
const SELECTED_UNITS = "Selected units: ";
const SELECTED_ARMY_UNIT_COUNT = "Total Units:  ";

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

const selectedArmyUnitCountLabel = 
    new labelClass({
        text: SELECTED_ARMY_UNIT_COUNT + " 0",
        width: 200, 
        x: LABEL_X,
        y: 248,
    })

const WORLD_SIDEBAR_LABELS = [
    selectedWorldEntityLabel,
    movementPointsLabel,
    selectedArmyUnitCountLabel,
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

const CITY_SIDEBAR_LABEL_OFFSET = 20;
const CITY_SIDEBAR_LABELS = [
    new labelClass({
        label: "City Info",
        width: 200,
        x: canvas.width - (SIDEBAR_WIDTH + CITY_SIDEBAR_LABEL_OFFSET),
        y: 200,
    }),

    new labelClass({
        text: function() {
            const population = selectedCityPopulation();
            return "Population: " + population;
        },
        textAlign: 'left',
        textColor: 'blue',
        width: 50,
        x: canvas.width - (SIDEBAR_WIDTH + CITY_SIDEBAR_LABEL_OFFSET),
        y: 240,
    }),

    new labelClass({
        text: function() {
            const city = selectedCity();
            const population = selectedCityPopulation();
            let populationNextTurn = population;
            if (city != null) {
                populationNextTurn += city.newBirths();
            }
            return "Population next turn: " + populationNextTurn;
        },
        textAlign: 'left',
        textColor: 'blue',
        width: 50,
        x: canvas.width - (SIDEBAR_WIDTH + CITY_SIDEBAR_LABEL_OFFSET),
        y: 280,
    }),

    new labelClass({
        text: function() {
            const city = selectedCity();
            let goldNextTurn = playerGold;
            if (city != null) {
                goldNextTurn += city.goldProduced();
            }
            return "Gold next turn: " + goldNextTurn;
        },
        textAlign: 'left',
        textColor: 'blue',
        width: 50,
        x: canvas.width - (SIDEBAR_WIDTH + CITY_SIDEBAR_LABEL_OFFSET),
        y: 320,
    }),
]
