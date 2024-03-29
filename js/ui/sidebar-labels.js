const LABEL_X = 600; // left column of all large sidebar labels

const SELECTED_WORLD_ENTITY = "Selected: ";
const MOVEMENT_POINTS = "Move points: ";
const CITY_SIDEBAR_LABEL_OFFSET = 20;
const SELECTED_UNITS = "Selected:";
const SELECTED_ARMY_UNIT_COUNT = "Total Units:  ";

const selectedWorldEntityArmyLabels = [
        new labelClass({
            tag: "worldArmy",
            text: " ",
            width: 200, 
            x: LABEL_X,
            y: 200,
        }),
        new labelClass({
            tag: "worldArmy",
            text: MOVEMENT_POINTS + " 0",
            width: 200, 
            x: LABEL_X,
            y: 224,
        }),
        new labelClass({
            tag: "worldArmy",
            text: SELECTED_ARMY_UNIT_COUNT + " 0",
            width: 200, 
            x: LABEL_X,
            y: 248,
        })
    ];

const selectedWorldEntityCityLabels = [
        new labelClass({
            tag: "worldCity",
            label: "City Info",
            width: 200,
            x: canvas.width - (SIDEBAR_WIDTH + CITY_SIDEBAR_LABEL_OFFSET),
            y: 200,
        }),

        new labelClass({
            tag: "worldCity",
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
            tag: "worldCity",
            text: function() {
                const city = selectedCity();
                const population = selectedCityPopulation();
                let populationNextTurn = population;
                if (city != null) {
                    populationNextTurn += city.newBirths();
                }
                return "Next Pop.: " + populationNextTurn;
            },
            textAlign: 'left',
            textColor: 'blue',
            width: 50,
            x: canvas.width - (SIDEBAR_WIDTH + CITY_SIDEBAR_LABEL_OFFSET),
            y: 280,
        }),

        new labelClass({
            tag: "worldCity",
            text: function() {
                const city = selectedCity();
                let goldNextTurn = playerGold;
                if (city != null) {
                    goldNextTurn += city.goldProduced();
                }
                return "Next Gold: " + goldNextTurn;
            },
            textAlign: 'left',
            textColor: 'blue',
            width: 50,
            x: canvas.width - (SIDEBAR_WIDTH + CITY_SIDEBAR_LABEL_OFFSET),
            y: 320,
        }),
    ];

const WORLD_SIDEBAR_LABELS = [
    ...selectedWorldEntityArmyLabels,
    ...selectedWorldEntityCityLabels,
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

function updateWorldEntitySidebarLabels(selectedWorldEntity) {
    currentSidebarLabels = [];

    if (selectedWorldEntity instanceof armyClass) {
        currentSidebarLabels = WORLD_SIDEBAR_LABELS.filter(label => label.tag == "worldArmy");

        selectedWorldEntityArmyLabels[0].text = "Army Info"; //String(selectedWorldEntity.name);
        if (selectedWorldEntity.currentPath) {
            selectedWorldEntityArmyLabels[1].text = MOVEMENT_POINTS + String(selectedWorldEntity.currentMovementPoints - selectedWorldEntity.currentPath.length);
        }
        if (selectedWorldEntity instanceof armyClass) {
            selectedWorldEntityArmyLabels[2].text = 
                SELECTED_ARMY_UNIT_COUNT + String(selectedWorldEntity.troopCount());
        }
    }

    if (selectedWorldEntity instanceof cityClass) {
        currentSidebarLabels = WORLD_SIDEBAR_LABELS.filter(label => label.tag == "worldCity");
    }
}

