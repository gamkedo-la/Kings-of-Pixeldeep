const CITY_PANEL_X = 100;
const CITY_PANEL_Y = 150;
const CITY_PANEL_W = 300;
const CITY_PANEL_H = 300;

/*
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
        name: 'wheatFields',
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
*/

var showCityPanel = false;
var viewingCity = null;
//var cityWorkers = [];
//var selectedCityWorkers = [];

var cityPanelControls = [
    new sliderClass({
        x: CITY_PANEL_X + 25,
        y: CITY_PANEL_Y + 25,
    }),
    new buttonClass({
        label: 'value', //cityPanelControls[0].currentValue,
        x: CITY_PANEL_X + 200 + 15,
        y: CITY_PANEL_Y + 25,
        color: 'tan',
        textColor: 'grey',
    }),
    new buttonClass({
	label: "Close",
	onClick: function() {
        console.log("clicked city close button");
	    closeCityPanel();
	},
        x: CITY_PANEL_X + CITY_PANEL_W - 100,
        y: CITY_PANEL_Y + CITY_PANEL_H - 50,
    }),
];

function openCityPanel(city) {
    console.log("opening city panel for", city.name);
    viewingCity = city;
    showCityPanel = true;

    /*
    // tmp workers for testing
    cityWorkers = [];
    for(var i=0;i<10;i++) {
        let newWorker = new workerClass({
            workerPlace: 3,
        });
        cityWorkers.push(newWorker);
    }
    */
}

function closeCityPanel() {
    showCityPanel = false;
    viewingCity = null;
    //cityWorkers = [];
}

function drawCityPanel() {
    //canvasContext.drawImage(cityPanelBackdrop, CITY_PANEL_X,CITY_PANEL_Y);
    colorRect(CITY_PANEL_X,CITY_PANEL_Y, CITY_PANEL_W,CITY_PANEL_H, 'tan'); 
    // TODO: City panel w & h vars
    for(var i=0;i<cityPanelControls.length;i++) {
        cityPanelControls[i].draw();
    }
    /*
    for(var i=0;i<cityWorkers.length;i++) {
        cityWorkers[i].draw();
    }

    for(var i=0;i<selectedCityWorkers.length;i++) {
        selectedCityWorkers[i].drawSelectionBox();
    }
    */
}

function handleCityPanelClick(mousePos) {
    for(let i=0;i<cityPanelControls.length;i++) {
        let currentButton = cityPanelControls[i];
        if(isClickOnButton(mousePos, currentButton)) {
            currentButton.onClick();
        }
    }
}
