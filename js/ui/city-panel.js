const CITY_PANEL_X = 100;
const CITY_PANEL_Y = 150;
const CITY_PANEL_W = 300;
const CITY_PANEL_H = 400;

var showCityPanel = false;
var viewingCity = null;
//var cityWorkers = [];
//var selectedCityWorkers = [];

var cityPanelControls = [
    new buttonClass({
        x: CITY_PANEL_X + 25,
        y: CITY_PANEL_Y + 25,
        label: 'Population: ??', // filled in openCityPanel()
        color: 'lightgrey',
        textColor: 'blue',
    }),
    new sliderClass({
        x: CITY_PANEL_X + 25,
        y: CITY_PANEL_Y + 75,
        showValue: true,
        label: "🌲",
    }),
    new sliderClass({
        x: CITY_PANEL_X + 25,
        y: CITY_PANEL_Y + 125,
        showValue: true,
        label: "🌾"
    }),
    new sliderClass({
        x: CITY_PANEL_X + 25,
        y: CITY_PANEL_Y + 175,
        showValue: true,
        label: "🐴",
    }),
    new sliderClass({
        x: CITY_PANEL_X + 25,
        y: CITY_PANEL_Y + 225,
        showValue: true,
        label: "⛏️",
    }),
    new sliderClass({
        x: CITY_PANEL_X + 25,
        y: CITY_PANEL_Y + 275,
        showValue: true,
        label: "⚒️",
    }),
    /*
    new buttonClass({
        label: 'value', //cityPanelControls[0].currentValue,
        x: CITY_PANEL_X + 200 + 15,
        y: CITY_PANEL_Y + 25,
        color: 'tan',
        textColor: 'grey',
    }),
    */
    new buttonClass({
	label: "Close",
    color: 'wheat',
	onClick: function() {
        console.log("clicked city close button");
	    closeCityPanel();
	},
        x: CITY_PANEL_X + CITY_PANEL_W - 100,
        y: CITY_PANEL_Y + CITY_PANEL_H - 50,
    }),
];


function openCityPanel(city) {
    console.log("opening city panel for", city.name, city);

    let populationFields = [
        "forestry",
        "wheatFields",
        "stables",
        "mines",
        "blacksmiths",
    ];

    viewingCity = city;
    cityPanelControls[0].label = "Population: "+ city.population.total;

    let cityControlIdx = 1;
    for(var i=0;i<populationFields.length;i++) {
        cityPanelControls[cityControlIdx].currentValue = 
            city.population[populationFields[i]];
        cityControlIdx++;
    }
    //cityPanelControls[1].label = cityPanelControls[0].modelValue;
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
    //cityPanelControls[0].modelValue = null;
    //cityWorkers = [];
}

function drawCityPanel() {
    //canvasContext.drawImage(cityPanelBackdrop, CITY_PANEL_X,CITY_PANEL_Y);
    colorRect(CITY_PANEL_X,CITY_PANEL_Y, CITY_PANEL_W,CITY_PANEL_H, 'lightgrey'); 
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
    /*
    for(let i=0;i<cityPanelControls.length;i++) {
        let currentButton = cityPanelControls[i];
        if(isClickOnButton(mousePos, currentButton)) {
            if(currentButton instanceof sliderClass) {
                currentButton.calculateValueFromMousePos(mousePos);
            } else {
                currentButton.onClick();
            }
        }
    }
    */
}

function handleCityPanelMousemove(mousePos) {
    for(let i=0;i<cityPanelControls.length;i++) {
        let currentButton = cityPanelControls[i];
        if(isClickOnButton(mousePos, currentButton)) {
            if(currentButton instanceof sliderClass) {
                // slider mousemoveHandler does the isDragging check
                currentButton.mousemoveHandler(mousePos);
            }  
        }
    }
}

function handleCityPanelMouseup(mousePos) {
    for(let i=0;i<cityPanelControls.length;i++) {
        let currentButton = cityPanelControls[i];
        if(isClickOnButton(mousePos, currentButton)) {
            if(currentButton instanceof sliderClass) {
                //currentButton.calculateValueFromMousePos(mousePos);
                currentButton.mouseupHandler(mousePos);
            } else {
                currentButton.onClick();
            }
        }
    }
}

function handleCityPanelMousedown(mousePos) {
    for(let i=0;i<cityPanelControls.length;i++) {
        let currentButton = cityPanelControls[i];
        if(isClickOnButton(mousePos, currentButton)) {
            if(currentButton instanceof sliderClass) {
                //currentButton.calculateValueFromMousePos(mousePos);
                currentButton.mousedownHandler(mousePos);
            } else {
                //currentButton.onClick();
            }
        }
    }
}

