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
        //console.log("slider group mousemove");
        for(let i=0;i<this.sliders.length;i++) {
            let currentSlider = this.sliders[i];
            if(/*isClickOnButton(mousePos, currentSlider) &&*/ currentSlider.isDragging) {
                //console.log("current slider is dragging");
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

    this.getModifiableSliders = function(changedIndex) {

        return this.sliders.filter( 
            (slider) => slider.currentValue > slider.minValue &&
                slider.currentValue < slider.maxValue &&
                slider.label != this.sliders[changedIndex].label 
        );
    };

    this.equalizeSliders = function(changedSlider, changedIndex) {
        console.log("equalizing sliders:", changedSlider.label, '('+changedIndex+')');
        //let currentSliderIndex = changedIndex;
        let valueDelta = changedSlider.currentValue - changedSlider.oldValue;

        let valueDeltaRemaining = valueDelta;
        /*
        let changePerSlider = Math.floor(valueDelta / (this.sliders.length - 1));
            // subtracting 1 here because we don't need to apply any change to the
            // slider that was just changed, making 1 less slider to change
        let valueDeltaRemaining = valueDelta % (this.sliders.length - 1);
        */
        
        
        // debug vars
        let sliderValues = this.sliders.map(slider => slider.currentValue);
        let sliderTotal = 0;
        for(const val of sliderValues) {
            sliderTotal += val;
        }
        console.log("value delta", valueDelta, "slider values", 
            sliderValues, "total", sliderTotal);


        // limiting # of tries to avoid infinite looping
        let triesLeft = 100;

        while(Math.abs(valueDeltaRemaining) > 0 && triesLeft > 0) {
            console.log("valueDeltaRemaining", valueDeltaRemaining);
            console.log("triesLeft", triesLeft);

            //get remaining modifiable sliders
            let modifiableSliders = this.getModifiableSliders(changedIndex);
            console.log('modifiableSliders', modifiableSliders.map(slider => slider.label));

            // see how much we can change the sliders this round
            let changePerSlider = 1; 
            if(Math.abs(valueDeltaRemaining) > modifiableSliders.length) {
                // if we can jump sliders by more than 1, do it;
                changePerSlider = Math.floor(valueDeltaRemaining / modifiableSliders.length);
            } 
            console.log("changePerSlider", changePerSlider);

            // change the sliders
            // NOTE: this does not yet work on sliders where minValue > 0
            for(let i=0;i<modifiableSliders.length;i++) {
                console.log('checking slider: '+modifiableSliders[i].label);
                if(Math.abs(valueDeltaRemaining) > 0) { // (in case we ran out last loop)
                    // TODO: problem: if Math.abs(valueDeltaRemaining) > 0 but less than
                    // changePerSlider, it will still try and update the slider by the full
                    // changePerSlider. Need to fix this somehow
                    let slider = modifiableSliders[i];

                    slider.oldValue = slider.currentValue;

                    console.log('updating slider: ', slider.label, '; change of: ', changePerSlider);

                    if( ( changePerSlider > 0 && slider.currentValue > changePerSlider ) ||
                        ( changePerSlider < 0 && slider.currentValue > Math.abs(changePerSlider) ) ) {
                        console.log('changing full value');

                        slider.currentValue = slider.currentValue + changePerSlider;
                        valueDeltaRemaining = valueDeltaRemaining - changePerSlider;
                        
                        console.log('new slider value:', slider.currentValue);
                        console.log('new valueDeltaRemaining:', valueDeltaRemaining);
                    } else {
                        console.log('setting slider to 0');

                        slider.currentValue = 0;
                        valueDeltaRemaining = valueDeltaRemaining - slider.oldValue;

                        console.log('new slider value:', slider.currentValue);
                        console.log('new valueDeltaRemaining:', valueDeltaRemaining);
                    } // end else
                } // end if Math.abs(valueDeltaRemaining) > 0
            } // end for loop
            
            triesLeft--;

        } // end while loop
        
        // TODO: 
        // - fix infinite loop condition when valueDeltaRemaining doesn't divide evenly
        // between modifiableSliders
        // - clean this up into a single while loop
        // - max tries safety valve again?
        // - ugh...

        
        /*
        for(let i=0;i<this.sliders.length;i++) {
            if(i != changedIndex) {
                let slider = this.sliders[i];
                console.log("applying change", slider.label, changePerSlider);
                slider.oldValue = slider.currentValue;
                if(slider.currentValue > changePerSlider) {
                    slider.currentValue = slider.currentValue - changePerSlider;
                } else {
                    valueDeltaRemaining += changePerSlider - slider.currentValue;
                    slider.currentValue = 0;
                }
            }
        }
        */


        // these two vars are just for console logging and debugging
        //let sliderValues = this.sliders.map(slider => slider.currentValue);
        //let sliderTotal = 0;
        //for(const val of sliderValues) {
        //    sliderTotal += val;
        //}
        //console.log("value delta", valueDelta, "slider values", 
        //    sliderValues, "total", sliderTotal);
        
        /*
        // temp limit for testing
        let currentTry = 0;
        let tryLimit = 100;

        while(Math.abs(valueDelta) > 0 && currentTry < tryLimit) {
            console.log("running equalizer; try:", currentTry,"value delta:", valueDelta);
            if(currentTry >= tryLimit) {
                console.error("Error equalizing sliders: Max number of tries reached");
            }

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

        }
        */
    };

}
