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

    this.lastEqualizedIdx = 0;

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
        let sliderMax = this.values.total;
        let currentSliderY = 0;

        for(const [key, val] of Object.entries(this.values)) {
            if(key != "total") {
                console.log("pushing slider", key, val);
                this.sliders.push(
                    new sliderClass({
                        x: this.x,
                        y: this.y + currentSliderY,
                        showValue: true,
                        label: key,
                        currentValue: val,
                        maxValue: sliderMax,
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
            currentSlider.isDragging = false;
            if(isClickOnButton(mousePos, currentSlider)) {
                currentSlider.mouseupHandler(mousePos);
                console.log("slider group mouseup handler calling eq sliders")
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
        //let currentSliderIndex = changedIndex;
        let valueDelta = changedSlider.currentValue - changedSlider.oldValue;
        console.log("value delta", valueDelta, "slider values", 
            this.sliders.map(slider => slider.currentValue));
        
        // temp limit for testing
        let currentTry = 0;
        let tryLimit = 10;

        while(Math.abs(valueDelta) > 0 && currentTry < tryLimit) {
            console.log("running equalizer; value delta:", valueDelta);

            // checks to make sure we don't need to stop changing sliders
            if(Math.abs(valueDelta) < 1) {
                console.log("value delta is less than 1, aborting");
                break;
            }
            if(currentTry === tryLimit) {
                console.log("hit tryLimit, aborting");
                break;
            }

            // go to next slider
            this.lastEqualizedIdx++;
            // if it's the slider the player changed, skip it
            if(this.lastEqualizedIdx === this.sliders.indexOf(changedSlider)) {
                this.lastEqualizedIdx++
            }
            // if we hit the bottom of the slider list, go back to the top
            if(this.lastEqualizedIdx >= this.sliders.length) {
                this.lastEqualizedIdx = 0;
            }

            // now we know what slider to update, so let's update it
            let sliderToChange = this.sliders[this.lastEqualizedIdx];
            console.log("changingSlider", sliderToChange.label, "valueDelta", valueDelta);

            // if valueDelta is positive and slider above 0
            if(valueDelta > 0 && sliderToChange.currentValue > 0) { 
                // subtract from the slider
                sliderToChange.currentValue--; 
                // subtract from valueDelta
                valueDelta--; 
                
            // else if valueDelta is negative and slider is below max
            } else if(valueDelta < 0 && sliderToChange.currentValue <
                sliderToChange.maxValue) { 

                // add to the slider
                sliderToChange.currentValue++;  
                // add to valueDelta
                valueDelta++; 
            }

            // keep count of our tries to avoid infinite looping
            currentTry++;
            if(currentTry >= tryLimit) {
                console.error("Error equalizing sliders: Max number of tries reached");
            }

        }
    };

}
