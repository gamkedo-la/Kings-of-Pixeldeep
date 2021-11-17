function sliderClass(configObj) {

    this.x = null;
    this.y = null;
    this.width = 200;
    this.height = 30;

    this.barWidth = this.width;
    this.barHeight = 10;
    this.barColor = 'darkgrey';

    this.handleWidth = 10;
    this.handleHeight = this.height;
    this.handleColor = 'grey'

    this.minValue = 0;
    this.maxValue = 100;
    this.currentValue = 25;

    this.isDragging = false;


    for(const [key, val] of Object.entries(configObj)) {
	if(val) {
	    this[key] = val;
	}
    }

    this.scaleFactor = function() {
	return this.barWidth / (this.maxValue - this.minValue);
    }

    this.draw = function() {
	// backdrop to hint clickable area
	colorRect(this.x,this.y, this.width,this.height, 'wheat');
	// bar
	colorRect(this.x + 10,
	    this.y + this.height / 2 - this.barHeight / 2,
	    this.barWidth, this.barHeight, 
	    this.barColor);
	// handle
	colorRect(this.x + this.currentValue * this.scaleFactor(),
	    this.y,
	    this.handleWidth, this.handleHeight, 
	    this.handleColor);
    }

    this.setup = function() {
	// TODO: add event listeners somehow
    }

    this.mousedownHandler() {
	this.isDragging = true;
    }

    this.mousemoveHandler() {
	if(this.isDragging) {
	    // TODO: calculatemousePos && use mousePos.x to calculate current value
	}
    }

    this.mouseupHandler() {
	this.isDragging = false;
	// TODO: calculate this.currentValue from mousePos.x
    }
}
