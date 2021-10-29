const CITY_PANEL_X = 10;
const CITY_PANEL_Y = 100;

const CITY_SECTIONS = [
    {
        name: 'forestry',
        color: 'red',
        minX: 25,
        maxX: 200,
        minY: 115,
        maxY: 300,
    },
    {
        name: 'wheat-fields',
        color: 'green',
        minX: 210,
        maxX: 395,
        minY: 115,
        maxY: 300,
    },
    {
        name: 'stables',
        color: 'sienna',
        minX: 400,
        maxX: 585,
        minY: 115,
        maxY: 300,
    },
    {
        name: 'mines',
        color: 'grey',
        minX: 15,
        maxX: 200,
        minY: 315,
        maxY: 505,
    },
    {
        name: 'idle',
        color: 'cyan',
        minX: 210,
        maxX: 395,
        minY: 315,
        maxY: 505,
    },
    {
        name: 'blacksmith',
        color: 'black',
        minX: 400,
        maxX: 585,
        minY: 315,
        maxY: 505,
    },
]

var showCityPanel = false;
var viewingCity = null;
var cityWorkers = [];
var selectedCityWorkers = [];

var cityPanelButtons = [
    new buttonClass({
	label: "Close",
	onClick: function() {
        console.log("clicked city close button");
	    closeCityPanel();
	},
        x: 505,
        y: 520,
    }),
];

function openCityPanel(city) {
    console.log("opening city panel for", city.name);
    viewingCity = city;
    showCityPanel = true;

    // tmp workers for testing
    cityWorkers = [];
    for(var i=0;i<10;i++) {
        let newWorker = new workerClass({
            workerPlace: 3,
        });
        cityWorkers.push(newWorker);
    }
}

function closeCityPanel() {
    showCityPanel = false;
    viewingCity = null;
    cityWorkers = [];
}

function drawCityPanel() {
    canvasContext.drawImage(cityPanelBackdrop, CITY_PANEL_X,CITY_PANEL_Y);
    for(var i=0;i<cityPanelButtons.length;i++) {
        cityPanelButtons[i].draw();
    }
    // TODO: also draw city panel workers
    // TODO: make array of arrays of workers with an index array for keeping track of 
    // which grp is which? EDIT: not sure separate arrays are necessary if we keep track
    // of worker type on the worker object itself
    for(var i=0;i<cityWorkers.length;i++) {
        cityWorkers[i].draw();
    }

    for(var i=0;i<selectedCityWorkers.length;i++) {
        selectedCityWorkers[i].drawSelectionBox();
    }
}

function handleCityPanelClick(mousePos) {
    for(let i=0;i<cityPanelButtons.length;i++) {
        let currentButton = cityPanelButtons[i];
        if(isClickOnButton(mousePos, currentButton)) {
            currentButton.onClick();
        }
    }
}
