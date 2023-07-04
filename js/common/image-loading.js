var cityPic = document.createElement("img");
var playerArmyPic = document.createElement("img");
var enemyArmyPic = document.createElement("img");
var worldTerrain = document.createElement("img");
var forestTerrain = document.createElement("img");
var farmTerrain = document.createElement("img");
var rowsThatFitOnScreen = document.createElement("img");
var battleTerrain  = document.createElement("img");
var placeholderUnitAtk = document.createElement("img");
var placeholderUnitWalk = document.createElement("img");
var placeholderUnitSingleFrame = document.createElement("img");
var cityPanelBackdrop = document.createElement("img");
var worldPics = [];
var unitPics = [];

var picsToLoad = 0; //set automatically based on number of imageList in loadImages()


function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	//console.log(picsToLoad);
	if(picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady();
	imgVar.src = "images/" + fileName;
}

function loadImageForWorldCode(worldCode, fileName) {
	worldPics[worldCode] = document.createElement("img");
	beginLoadingImage(worldPics[worldCode], fileName);
}

function loadImageForUnitCode(unitCode, fileName) {
	unitPics[unitCode] = document.createElement("img");
	beginLoadingImage(unitPics[unitCode], fileName);
}

function loadImages() {

	var imageList = [
		{varName: cityPic, theFile: "track_flag.png"},
		{varName: playerArmyPic, theFile: "Person1.png"},
		{varName: enemyArmyPic, theFile: "Person1-alt-color.png"},
		{varName: worldTerrain, theFile: "world_terrain.png"},
		{varName: forestTerrain, theFile: "forestSprite.png"},
		{varName: farmTerrain, theFile: "farmSprite.png"},
		{varName: battleTerrain, theFile: "battle_terrain.png"},

		{varName: placeholderUnitAtk, theFile: "pixeldeep-placeholder-atk.png"},
		{varName: placeholderUnitWalk, theFile: "pixeldeep-placeholder-walk.png"},
		{varName: placeholderUnitSingleFrame, theFile: "placeholder-unit-single-frame.png"},
		{varName: cityPanelBackdrop, theFile: "city_screen_backdrop.png"},

		/*
		{worldType: WORLD_ROAD, theFile: "track_road.png"},
		{worldType: WORLD_WALL, theFile: "track_wall.png"},
		{worldType: WORLD_GOAL, theFile: "track_goal.png"},
		{worldType: WORLD_TREE, theFile: "track_tree.png"},
		{worldType: WORLD_FLAG, theFile: "track_flag.png"},

		{worldType: BATTLE_GRASS, theFile: "world_grass_2.png"},
		*/
		];

	picsToLoad = imageList.length;

	for(var i=0; i<imageList.length; i++) { 
		if(imageList[i].varName != undefined) {
			beginLoadingImage(imageList[i].varName, imageList[i].theFile);
		} else {
			loadImageForWorldCode( imageList[i].worldType, imageList[i].theFile );
		}	
	}
}
