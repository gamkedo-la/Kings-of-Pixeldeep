const WORKER_PLACEHOLDER_RADIUS = 10;
const WORKER_SELECT_DIM_HALF = WORKER_PLACEHOLDER_RADIUS + 3;

function workerClass(configObj) {
    this.x = 100;
    this.y = 100;
    this.color = 'white';
    this.workerPlace = CITY_SECTIONS[4];

    if(configObj && configObj.workerPlace) {
	this.workerPlace = CITY_SECTIONS[configObj.workerPlace];
    }

    // this function def needs to come before it gets called below
    this.goToRandomSpotInCityPanelSection = function() {
	this.x = Math.random() * (this.workerPlace.maxX - this.workerPlace.minX) + 
	    this.workerPlace.minX;
	this.y = Math.random() * (this.workerPlace.maxY - this.workerPlace.minY) + 
	    this.workerPlace.minY;
    }

    console.log("generating worker", this.workerPlace.name); 

    this.color = this.workerPlace.color;
    this.goToRandomSpotInCityPanelSection();


    this.moveTo = function(newWorkerPlaceIdx) {
	this.workerPlace = CITY_SECTIONS[newWorkerPlaceIdx];
	this.goToRandomSpotInCityPanelSection();
    }

    this.draw = function() {
      colorCircle(this.x,this.y, WORKER_PLACEHOLDER_RADIUS, this.color);
    }
}
