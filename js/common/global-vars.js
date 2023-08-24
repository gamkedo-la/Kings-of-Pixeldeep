// This file is for global vars that need to be initialized first so they can be 
// more easily referenced by the rest of the code
var canvas, canvasContext;
var turnNumber = 1;

canvas = document.getElementById('gameCanvas');
canvasContext = canvas.getContext('2d');


// world terrain
const WORLD_MOUNTAINS = 1;
const WORLD_FOREST = 2;
const WORLD_GRASS = 3;
const WORLD_FARM = 4;
const WORLD_WATER = 5;
const WORLD_SHALLOWS = 6;

// seasons vars 
const SEASON_SUMMER = 1;
const SEASON_WINTER = 2;

// battle terrain
const BATTLE_FIELD = 11;
const BATTLE_TREES = 12;
const BATTLE_ROCKS = 13;
const BATTLE_BUSHES = 14;
const BATTLE_MUD = 15;
const BATTLE_WATER = 16;
const BATTLE_SHALLOWS = 17;

var gameOptions = {
    showGrid: false,
    showDebug: false,
    cameraPanSpeed: 10,
    cameraEdgePanEnabled: true,
    cameraEdgePanSize: 60,
}

