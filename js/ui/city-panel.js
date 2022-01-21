const CITY_PANEL_X = 100;
const CITY_PANEL_Y = 150;
const CITY_PANEL_W = 300;
const CITY_PANEL_H = 300;

var showCityPanel = false;
var viewingCity = null;
//var cityWorkers = [];
//var selectedCityWorkers = [];

var cityPanelControls = [
    new sliderClass({
        x: CITY_PANEL_X + 25,
        y: CITY_PANEL_Y + 25,
        showValue: true,
    }),
    new sliderClass({
        x: CITY_PANEL_X + 25,
        y: CITY_PANEL_Y + 75,
        showValue: true,
    }),
    new sliderClass({
        x: CITY_PANEL_X + 25,
        y: CITY_PANEL_Y + 125,
        showValue: true,
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
    cityPanelControls[0].modelValue = city.population.forestry;
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
    cityPanelControls[0].modelValue = null;
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

