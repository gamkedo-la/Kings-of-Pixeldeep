const POPULATION_GROWTH_RATE = 0.1;
const CITY_TYPE_PLAYER = 1;
const CITY_TYPE_ENEMY = 2;
const CITY_TYPE_NEUTRAL = 3;

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
    this.cityType = CITY_TYPE_NEUTRAL;
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


    /*
    this.setPosition = function(col,row) {
        this.worldCol = col;
        this.worldRow = row;
    }
    */

    this.construct = function(cityName/*, imageToUse*/) {
	    this.name = cityName;
	    //this.cityImg = imageToUse; // if/when we have more than one
    }
	
    this.draw = function() {
        sX = sY = 0;
        if (this.cityType === CITY_TYPE_PLAYER) {
            sX = LEVEL_TILE_W  * 1;
        } else if (this.cityType === CITY_TYPE_ENEMY) {
            sX = LEVEL_TILE_W  * 2;
        } else { // if (this.cityType === CITY_TYPE_NEUTRAL)
            sX = LEVEL_TILE_W  * 0;
        }

        // TODO: Find out why must add TILE_W to this.x
        drawBitmapPartialCenteredWithRotation(
            this.picToUse, this.x()+LEVEL_TILE_W,this.y(),LEVEL_TILE_W, LEVEL_TILE_H, 
            withAngle=0,sX, sY, LEVEL_TILE_W, LEVEL_TILE_H);

        // TODO: draw city name under city? Debatable. Lords 2 doesn't, but...:shrug:
    }
    
    this.onClick = function() {
        openCityPanel(this);
    }
}
