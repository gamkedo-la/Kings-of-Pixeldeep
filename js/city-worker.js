const WORKER_PLACEHOLDER_RADIUS = 10;
const WORKER_SELECT_DIM_HALF = UNIT_PLACEHOLDER_RADIUS + 3;

function workerClass() {
    this.x = 100;
    this.y = 100;
    this.color = 'white';

    this.generateWorker(workerPlace) {
	switch(workerPlace) {
	    case "forestry":
		this.color = 'red';
	    case "wheat-fields":
		this.color = 'yellow';
	    case "stables":
		this.color = 'tan';
	    case "mines":
		this.color = 'grey';
	    case "idle":
		this.color = 'lightblue';
	    case "blacksmith":
		this.color = 'black';
	    default:
		this.color = 'lightgreen';
	}

	this.goToRandomSpotInCityPanelSection(workerPlace);
    }

    this.goToRandomSpotInCityPanelSection(workerPlace) {
	let minX = 0;
	let maxX = 0;
	let minY = 0;
	let maxY = 0;

	switch(workerPlace) {
	    case "forestry":
		minX = 105;
		maxX = 290;
		minY = 105;
		maxY = 300;
	    case "wheat-fields":
		minX = 300;
		maxX = 485;
		minY = 105;
		maxY = 300;
	    case "stables":
		minX = 490;
		maxX = 675;
		minY = 105;
		maxY = 300;
	    case "mines":
		minX = 105;
		maxX = 290;
		minY = 315;
		maxY = 505;
	    case "idle":
		minX = 300;
		maxX = 485;
		minY = 315;
		maxY = 505;
	    case "blacksmith":
		minX = 490;
		maxX = 675;
		minY = 315;
		maxY = 505;
	    default:
		minX = 300;
		maxX = 485;
		minY = 315;
		maxY = 505;
	}

	this.x = Math.random() * (maxX - minX) + minX;
	this.y = Math.random() * (mayY - minY) + minY;
    }

    this.moveTo(workerPlace) {
	this.goToRandomSpotInCityPanelSection(workerPlace);
    }

    this.draw() {
      colorCircle(this.x,this.y, WORKER_PLACEHOLDER_RADIUS, this.color);
    }
}
