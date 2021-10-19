const WORKER_PLACEHOLDER_RADIUS = 10;
const WORKER_SELECT_DIM_HALF = WORKER_PLACEHOLDER_RADIUS + 3;

function workerClass(configObj) {
    this.x = 100;
    this.y = 100;
    this.color = 'white';
    this.workerPlace = "forestry";

    if(this.configObj && this.configObj.workerPlace) {
	this.workerPlace = this.configObj.workerPlace;
    }

    this.generateWorker = function() {
	console.log("generating worker", this.workerPlace);
	switch(this.workerPlace) {
	    case "forestry":
		this.color = 'red';
		break;
	    case "wheat-fields":
		this.color = 'yellow';
		break;
	    case "stables":
		this.color = 'tan';
		break;
	    case "mines":
		this.color = 'grey';
		break;
	    case "idle":
		this.color = 'lightblue';
		break;
	    case "blacksmith":
		this.color = 'black';
		break;
	    default:
		this.color = 'lightgreen';
		break;
	}

	this.goToRandomSpotInCityPanelSection();
    }

    this.goToRandomSpotInCityPanelSection = function() {
	let minX = 0;
	let maxX = 0;
	let minY = 0;
	let maxY = 0;

	switch(this.workerPlace) {
	    case "forestry":
		minX = 115;
		maxX = 290;
		minY = 115;
		maxY = 300;
		break;
	    case "wheat-fields":
		minX = 300;
		maxX = 485;
		minY = 115;
		maxY = 300;
		break;
	    case "stables":
		minX = 490;
		maxX = 675;
		minY = 115;
		maxY = 300;
		break;
	    case "mines":
		minX = 105;
		maxX = 290;
		minY = 315;
		maxY = 505;
		break;
	    case "idle":
		minX = 300;
		maxX = 485;
		minY = 315;
		maxY = 505;
		break;
	    case "blacksmith":
		minX = 490;
		maxX = 675;
		minY = 315;
		maxY = 505;
		break;
	    default:
		minX = 300;
		maxX = 485;
		minY = 315;
		maxY = 505;
		break;
	}

	this.x = Math.random() * (maxX - minX) + minX;
	this.y = Math.random() * (maxY - minY) + minY;
    }

    this.moveTo = function(newWorkerPlace) {
	this.workerPlace = newWorkerPlace;
	this.goToRandomSpotInCityPanelSection();
    }

    this.draw = function() {
      colorCircle(this.x,this.y, WORKER_PLACEHOLDER_RADIUS, this.color);
    }
}
