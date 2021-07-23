var cityPic = document.createElement("img");
var armyPic = document.createElement("img");
var worldPics = [];

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

function loadImages() {

	var imageList = [
		{varName: cityPic, theFile: "track_flag.png"},
		{varName: armyPic, theFile: "Person1.png"},

		{worldType: WORLD_ROAD, theFile: "track_road.png"},
		{worldType: WORLD_WALL, theFile: "track_wall.png"},
		{worldType: WORLD_GOAL, theFile: "track_goal.png"},
		{worldType: WORLD_TREE, theFile: "track_tree.png"},
		{worldType: WORLD_FLAG, theFile: "track_flag.png"},

		{worldType: BATTLE_GRASS, theFile: "world_grass_2.png"},
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
