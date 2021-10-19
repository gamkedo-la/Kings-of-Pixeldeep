const CITY_PANEL_X = 100;
const CITY_PANEL_Y = 100;

var showCityPanel = false;
var viewingCity = null;
var cityWorkers = [];

var cityPanelButtons = [
    new buttonClass({
	label: "Close",
	onClick: function() {
	    closeCityPanel();
	},
	x: 595,
	y: 480,
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
	    workerPlace: "mines",
	});
	newWorker.generateWorker();
	//newWorker.wor
	//newWorker.goToRandomSpotInCityPanelSection();
	cityWorkers.push(newWorker);
    }
}

function closeCityPanel() {
    showCityPanel = false;
    viewingCity = null;
    cityWorkers = [];
}

function drawCityPanel() {
    canvasContext.drawImage(cityPanelBackdrop, 100,100);
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
}

function handleCityPanelClick(mousePos) {
    for(let i=0;i<cityPanelButtons.length;i++) {
	let currentButton = cityPanelButtons[i];
	if(isClickOnButton(mousePos, currentButton)) {
	    currentButton.onClick();
	}
    }
}
