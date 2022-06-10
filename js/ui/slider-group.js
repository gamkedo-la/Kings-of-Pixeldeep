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
        for(let i=0;i<this.sliders.length;i++) {
            let currentSlider = this.sliders[i];
            if(isClickOnButton(mousePos, currentSlider)) {
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
        let currentSliderIndex = changedIndex;
        let valueDelta = changedSlider.currentValue - changedSlider.oldValue;
        
        // TODO: make a (while Math.abs(valueDelta) > 0 ?) loop of this
        currentSliderIndex++;
        if(currentSliderIndex >= this.sliders.length) {
            currentSliderIndex = 0;
        }
        let sliderToChange = this.sliders[currentSliderIndex];
        sliderToChange.currentValue++; // -- if valueDelta is negative
        valueDelta--; // or ++ if negative
        // end loop
    };

}
