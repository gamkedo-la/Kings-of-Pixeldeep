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
    this.modelValue = null;

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
        colorRect(this.x,
            this.y + this.height / 2 - this.barHeight / 2,
            this.barWidth, this.barHeight, 
            this.barColor);
        // handle
        colorRect(this.x + this.currentValue * this.scaleFactor(),
            this.y,
            this.handleWidth, this.handleHeight, 
            this.handleColor);
    }

    this.mousedownHandler = function(evt) {
        console.log("slider mousedown");
        this.isDragging = true;
    }

    this.mousemoveHandler = function(evt) {
        console.log("slider mousemove");
        if(this.isDragging) {
            let mousePos = calculateMousePos(evt);
            this.calculateValueFromMousePos(mousePos);
        }
    }

    this.mouseupHandler = function(evt) {
        console.log("slider mouseup");
        let mousePos = calculateMousePos(evt);
        this.isDragging = false;
        this.calculateValueFromMousePos(mousePos);
    }

    this.calculateValueFromMousePos = function(mousePos) {
        if(mousePos.x < this.x) {
            this.currentValue = this.minValue;
        } else if (mousePos.x > this.x + this.width) {
            this.currentValue = this.maxValue;
        } else { // mousePos.x between min and max positions
            this.currentValue = (mousePos.x - this.x) / this.scaleFactor();
        }

        if(this.modelValue) {
            this.modelValue.value = this.currentValue;
        }
        console.log("slider value", this.currentValue);
    }
}

var showSliderTest = false;

