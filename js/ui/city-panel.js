const CITY_PANEL_X = 100;
const CITY_PANEL_Y = 100;

var showCityPanel = false;
var viewingCity = null;

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
}

function closeCityPanel() {
    showCityPanel = false;
    viewingCity = null;
}

function drawCityPanel() {
    canvasContext.drawImage(cityPanelBackdrop, 100,100);
    for(var i=0;i<cityPanelButtons.length;i++) {
	cityPanelButtons[i].draw();
    }
    // TODO: also draw city panel workers
}

function handleCityPanelClick(mousePos) {
    for(let i=0;i<cityPanelButtons.length;i++) {
	let currentButton = cityPanelButtons[i];
	if(isClickOnButton(mousePos, currentButton)) {
	    currentButton.onClick();
	}
    }
}
