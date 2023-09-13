const POPULATION_GROWTH_RATE = 0.1;
const POPULATION_GOLD_PRODUCE_RATE = 0.1;
const CITY_TYPE_PLAYER = 1;
const CITY_TYPE_ENEMY = 2;
const CITY_TYPE_NEUTRAL = 3;

function cityClass(configObj) {

    // set default values
    this.worldRow = 3;
    this.worldCol = 3;
    this.citySpriteImg = cityPic;
    this.name = "Untitled City";
    this.population = 100;
    this.cityType = CITY_TYPE_NEUTRAL;

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

    this.produceAndGrow = function() {
        if(this.cityType === CITY_TYPE_PLAYER) {
            // produce
            goldProduced = Math.round(this.population * POPULATION_GOLD_PRODUCE_RATE);
            playerGold += goldProduced;

            // grow
            let newBirths = Math.round(100 * (1 + POPULATION_GROWTH_RATE));
            this.population += newBirths;
        }
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

        if(selectedWorldEntity && selectedWorldEntity.name === this.name) {
            // draw highlighted border around selected city
            let highlightBorderWidth = 3;

            colorRect(
            (this.x() - LEVEL_TILE_W/2) - highlightBorderWidth,
            (this.y() - LEVEL_TILE_H/2) - highlightBorderWidth,
            LEVEL_TILE_W + (highlightBorderWidth * 2),
            LEVEL_TILE_H + (highlightBorderWidth * 2),
            'aqua', 
            );
        }

        drawBitmapPartialCenteredWithRotation(
            this.citySpriteImg, this.x(), this.y(), LEVEL_TILE_W, LEVEL_TILE_H, 
            withAngle=0, sX, sY, LEVEL_TILE_W, LEVEL_TILE_H);
    }
    
}
