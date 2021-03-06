const POPULATION_GROWTH_RATE = 0.1;

function cityClass(configObj) {

    // set default values
    this.worldRow = 3;
    this.worldCol = 3;
    this.picToUse = cityPic;
    this.name = "Untitled City";
    this.population = {
        total: 100,
        forestry: 30,
        wheatFields: 30,
        stables: 30,
        mines: 10,
        blacksmiths: 0,
        /*
        idle: function() {
            return this.population.total - ( 
                this.population.forestry +
                this.population.wheatFields +
                this.population.stables +
                this.population.mines +
                this.population.blacksmiths
            );
        },
        */

    };

    this.playerControlled = true;

    if(configObj) {
        for( const [key, val] of Object.entries(configObj) ) {
            if(val || val === 0) {
                this[key] = val;
            }
        }
    }

    this.worldIdx = function() {
        let idx = this.worldRow * level_cols + this.worldCol;
        //console.log(this.name, idx);
        return idx;
    }

    this.x = function() {
        //console.log("calling this.x");
        return (this.worldCol * LEVEL_TILE_W) + (LEVEL_TILE_W / 2);
    }
    this.y = function() {
        //console.log("calling this.y");
        return (this.worldRow * LEVEL_TILE_H) + (LEVEL_TILE_H / 2);
    }


    this.setPosition = function(col,row) {
        this.worldCol = col;
        this.worldRow = row;
    }

    this.construct = function(cityName/*, imageToUse*/) {
	    this.name = cityName;
	    //this.cityImg = imageToUse; // if/when we have more than one
    }
	
    this.draw = function() {
        drawBitmapCenteredWithRotation(this.picToUse, this.x(),this.y(), 0);
        // TODO: draw city name under city? Debatable. Lords 2 doesn't, but...:shrug:
    }
    
    this.onClick = function() {
        openCityPanel(this);
    }
}
