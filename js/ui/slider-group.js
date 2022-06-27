function sliderGroupClass(configObj) {
    // this class creates a group of linked sliders that must all total up 
    // to a value definded by the "total" key in the passed-in values object

    this.x = null;
    this.y = null;
    this.width = 200; // safe default? Not sure we'll use it
    // height determined by # of sliders
    
    this.values = {
        test1: 10,
        test2: 10,
        test3: 10,
        total: 30,
    };

    this.sliderGapInPixels = 10;

    for(const [key, val] of Object.entries(configObj)) {
        if(val) {
            this[key] = val;
        }
    }

    this.sliders = [];
    //this.currentSliderY = 0;
    this.sliderHeight = 30;

    this.updateSliders = function() {
        this.sliders = [];
        let currentSliderY = 0;

        for(const [key, val] of Object.entries(this.values)) {
            if(key != "total") {
                this.sliders.push(
                    new sliderClass({
                        x: this.x,
                        y: this.y + currentSliderY,
                        showValue: true,
                        label: key,
                        currentValue: val,
                    })
                );

                currentSliderY += this.sliderHeight + this.sliderGapInPixels;
            }
        }
    }

    this.draw = function() {
        for(var i=0;i<this.sliders.length;i++) {
            this.sliders[i].draw();
        }
    };

    this.mousemoveHandler = function(mousePos) {
        console.log("slider group mousemove");
        for(let i=0;i<this.sliders.length;i++) {
            let currentSlider = this.sliders[i];
            if(/*isClickOnButton(mousePos, currentSlider) &&*/ currentSlider.isDragging) {
                console.log("current slider is dragging");
                currentSlider.mousemoveHandler(mousePos);
                this.equalizeSliders(currentSlider, i);
            } 
        }
    };

    this.mouseupHandler = function(mousePos) {
        for(let i=0;i<this.sliders.length;i++) {
            let currentSlider = this.sliders[i];
            if(isClickOnButton(mousePos, currentSlider)) {
                currentSlider.mouseupHandler(mousePos);
                this.equalizeSliders(currentSlider, i);
            } 
        }
    };

    this.mousedownHandler = function(mousePos) {
        for(let i=0;i<this.sliders.length;i++) {
            let currentSlider = this.sliders[i];
            if(isClickOnButton(mousePos, currentSlider)) {
                currentSlider.mousedownHandler(mousePos);
                // mousedown only starts dragging, no need for 
                // equalizeSliders() yet
            } 
        }
    };

    this.equalizeSliders = function(changedSlider, changedIndex) {
        // TODO: find out how to only trigger this function if dragging a slider
        console.log("equalizing sliders", changedSlider, changedIndex);
        let currentSliderIndex = changedIndex;
        let valueDelta = changedSlider.currentValue - changedSlider.oldValue;
        console.log("value delta", valueDelta);
        
        while(Math.abs(valueDelta) > 0) {
            console.log("running equalizer; value delta:", valueDelta);

            if(Math.abs(valueDelta < 1)) {
                console.log("value delta is less than 1, aborting");
                break;
            }

            currentSliderIndex++;
            if(currentSliderIndex >= this.sliders.length) {
                currentSliderIndex = 0;
            }
            let sliderToChange = this.sliders[currentSliderIndex];

            if(valueDelta > 0) { // if valueDelta is positive
                sliderToChange.currentValue++; 
                valueDelta--; 
            } else if(valueDelta < 0) {
                sliderToChange.currentValue--; 
                valueDelta++; 
            }

            // Ok, current problems:
            // 1) equalizer math is not moving the other sliders correctly at all
            // 2) equalizer is often firing with values of 0.5 (which right now does nothing)
            //      and 1 (which doesn't sub-divide very well, obviously)
            // 3) these sliders need to work on any # of workers, but also ONLY hold integer
            //      values (having 0.25 workers on a task makes no sense)
            //      - Idea: enforce integer values in slider.calculateValueFromMousePos(),
            //          possibly adjusting the slider pos if necessary. This might have the
            //          effect of snapping the sliders into valid value positions (within a 
            //          reasonable tolerance, of course; no need to re-move the cursor every
            //          frame when the movement would be less than a pixel)
        }
    };

}
