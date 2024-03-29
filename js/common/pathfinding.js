// pathfinding.js by McFunkypants
// customized for use in kings of pixeldeep: uses levelGrid[]

// A slightly simplified version of A-Star pathfinding, 
// Edsger Dijkstra's 1959 algorithm, with contributions from
// Andrea Giammarchi, Alessandro Crugnola, Jeroen Beckers,
// Peter Hart, Nils Nilsson, and Bertram Raphael.

// add all traverseable map tile indeces to this array, a list of levelGrid sprite numbers
var walkableTiles = [
    // see js/common/global-vars.js for these numeric const definitions
    WORLD_FOREST, 
    WORLD_GRASS,
    WORLD_FARM,
    WORLD_SHALLOWS,
]; // any other tile index is considered a wall

// optional walkable tiles that add extra distance (movement cost) when entering
var walkableTileExtraCosts = [];
//walkableTileExtraCosts[WORLD_FOREST] = 100; 
walkableTileExtraCosts[WORLD_FARM] = 50; 
walkableTileExtraCosts[WORLD_SHALLOWS] = 20; 

// the result is in the form [[x,y],[x,y],etc];
// or it returns null if no path possible
function levelGridPathfind(ax,ay,bx,by)
{
    //console.log("pathfinding from "+ax+","+ay+" to "+bx+","+by);
    var pathStart = [ax,ay];
    var pathEnd = [bx,by];
    var world = [];
    // this algorithm wants a square 2d array
    var dim = Math.max(level_cols,level_rows);
    for (x=0; x<dim; x++) {
        world[x] = [];
        for (var y=0; y<dim; y++) {
            world[x][y] = levelGrid[x+y*level_cols]||0;
        }
    }

	if (!world || !world.length || !world[0].length) return null;
	// if we request somewhere outside the map, snap to edges
	if (pathStart[0]<0) pathStart[0]=0;
	if (pathStart[0]>world.length-1) pathStart[0]=world.length-1;
	if (pathStart[1]<0) pathStart[1]=0;
	if (pathStart[1]>world[0].length-1) pathStart[1]=world[0].length-1;
	if (pathEnd[0]<0) pathEnd[0]=0;
	if (pathEnd[0]>world.length-1) pathEnd[0]=world.length-1;
	if (pathEnd[1]<0) pathEnd[1]=0;
	if (pathEnd[1]>world[0].length-1) pathEnd[1]=world[0].length-1;
	
	// shortcuts for speed
	var	abs = Math.abs;
	var	max = Math.max;
	var	pow = Math.pow;
	var	sqrt = Math.sqrt;

	// the world data are integers:
	// anything higher than this number is considered blocked
	// this is handy is you use numbered sprites, more than one
	// of which is walkable road, grass, mud, etc
	var maxWalkableTileNum = 0;

	// keep track of the world dimensions
    // Note that this A-star implementation expects the world array to be square: 
	// it must have equal height and width. If your game world is rectangular, 
	// just fill the array with dummy values to pad the empty space.
	var worldWidth = world.length;
	var worldHeight = world[0].length;
	var worldSize =	worldWidth * worldHeight;

	// returns boolean value (world cell is available and open)
	function canWalkHere(x,y)
	{
		if (world[x] == null) return false;
        if (world[x][y] == null) return false;
        let allowed = walkableTiles.includes(world[x][y]);
        //console.log("world["+x+"]["+y+"]="+world[x][y]+" which is "+(allowed?"walkable":"blocked"));
        return allowed;
	};

	function tileDistExtraCost(x,y)
	{
		if (world[x] == null) return 0;
        if (world[x][y] == null) return 0;
        
        let theCost = walkableTileExtraCosts[world[x][y]];
        if (theCost!=undefined) return theCost;
        
        // default for tiles not listed in the array
        return 0;
	};

    // which heuristic should we use?

    // default: no diagonals (Manhattan)
	var distanceFunction = ManhattanDistanceWithCosts; // kings of pixeldeep mods! =)
	var findNeighbours = function(){}; // empty

	/*
	// alternate heuristics, depending on your game:

    // diagonals allowed but no sqeezing through cracks:
	var distanceFunction = DiagonalDistance;
	var findNeighbours = DiagonalNeighbours;

	// diagonals and squeezing through cracks allowed:
	var distanceFunction = DiagonalDistance;
	var findNeighbours = DiagonalNeighboursFree;

	// euclidean but no squeezing through cracks:
	var distanceFunction = EuclideanDistance;
	var findNeighbours = DiagonalNeighbours;

	// euclidean and squeezing through cracks allowed:
	var distanceFunction = EuclideanDistance;
	var findNeighbours = DiagonalNeighboursFree;

	*/

	// distanceFunction functions
	// these return how far away a point is to another

	// custom for kings of pixeldeep - not sure if this is correct
    function ManhattanDistanceWithCosts(Point, Goal)
	{	
		// we add the extra cost of the tile as extra distance
        let extraCost = tileDistExtraCost(Goal.x,Goal.y);
        //if (extraCost) console.log("extra cost for "+Goal.x+","+Goal.y+"="+extraCost);
        return extraCost + abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
	}

    function ManhattanDistance(Point, Goal)
	{	// linear movement - no diagonals - just cardinal directions (NSEW)
		return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
	}

	function DiagonalDistance(Point, Goal)
	{	// diagonal movement - assumes diag dist is 1, same as cardinals
		return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
	}

	function EuclideanDistance(Point, Goal)
	{	// diagonals are considered a little farther than cardinal directions
		// diagonal movement using Euclide (AC = sqrt(AB^2 + BC^2))
		// where AB = x2 - x1 and BC = y2 - y1 and AC will be [x3, y3]
		return sqrt(pow(Point.x - Goal.x, 2) + pow(Point.y - Goal.y, 2));
	}

	// Neighbours functions, used by findNeighbours function
	// to locate adjacent available cells that aren't blocked

	// Returns every available North, South, East or West
	// cell that is empty. No diagonals,
	// unless distanceFunction function is not Manhattan
	function Neighbours(x, y)
	{
		var	N = y - 1,
		S = y + 1,
		E = x + 1,
		W = x - 1,
		myN = N > -1 && canWalkHere(x, N),
		myS = S < worldHeight && canWalkHere(x, S),
		myE = E < worldWidth && canWalkHere(E, y),
		myW = W > -1 && canWalkHere(W, y),
		result = [];
		if(myN) result.push({x:x, y:N});
		if(myE) result.push({x:E, y:y});
		if(myS) result.push({x:x, y:S});
		if(myW) result.push({x:W, y:y});
		findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
		return result;
	}

	// returns every available North East, South East,
	// South West or North West cell - no squeezing through
	// "cracks" between two diagonals
	function DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result)
	{
		if(myN)
		{
			if(myE && canWalkHere(E, N))
				result.push({x:E, y:N});
			if(myW && canWalkHere(W, N))
				result.push({x:W, y:N});
		}
		if(myS)
		{
			if(myE && canWalkHere(E, S))
				result.push({x:E, y:S});
			if(myW && canWalkHere(W, S))
				result.push({x:W, y:S});
		}
	}

	// returns every available North East, South East,
	// South West or North West cell including the times that
	// you would be squeezing through a "crack"
	function DiagonalNeighboursFree(myN, myS, myE, myW, N, S, E, W, result)
	{
		myN = N > -1;
		myS = S < worldHeight;
		myE = E < worldWidth;
		myW = W > -1;
		if(myE)
		{
			if(myN && canWalkHere(E, N))
			result.push({x:E, y:N});
			if(myS && canWalkHere(E, S))
			result.push({x:E, y:S});
		}
		if(myW)
		{
			if(myN && canWalkHere(W, N))
			result.push({x:W, y:N});
			if(myS && canWalkHere(W, S))
			result.push({x:W, y:S});
		}
	}

	// Node function, returns a new object with Node properties
	// Used in the calculatePath function to store route costs, etc.
	function Node(Parent, Point)
	{
		var newNode = {
			// pointer to another Node object
			Parent:Parent,
			// array index of this Node in the world linear array
			value:Point.x + (Point.y * worldWidth),
			// the location coordinates of this Node
			x:Point.x,
			y:Point.y,
			// the heuristic estimated cost
			// of an entire path using this node
			f:0,
			// the distanceFunction cost to get
			// from the starting point to this node
			g:0
		};

		return newNode;
	}

	// Path function, executes AStar algorithm operations
	function calculatePath()
	{
		// create Nodes from the Start and End x,y coordinates
		var	mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
		var mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
		// create an array that will contain all world cells
		var AStar = new Array(worldSize);
		// list of currently open Nodes
		var Open = [mypathStart];
		// list of closed Nodes
		//var Closed = [];
		// list of the final output array
		var result = [];
		// reference to a Node (that is nearby)
		var myNeighbours;
		// reference to a Node (that we are considering now)
		var myNode;
		// reference to a Node (that starts a path in question)
		var myPath;
		// temp integer variables used in the calculations
		var length, max, min, i, j;
		// iterate through the open list until none are left
		while(length = Open.length)
		{
			max = worldSize;
			min = -1;
			for(i = 0; i < length; i++)
			{
				if(Open[i].f < max)
				{
					max = Open[i].f;
					min = i;
				}
			}
			// grab the next node and remove it from Open array
			myNode = Open.splice(min, 1)[0];
			// is it the destination node?
			if(myNode.value === mypathEnd.value)
			{
				//myPath = Closed[Closed.push(myNode) - 1]; // original
				myPath = myNode; //Closed[Closed.push(myNode) - 1]; // OPTIMIZED CLOSED LIST OUT
				do
				{
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				// clear the working arrays
				AStar /*= Closed*/ = Open = [];
				// we want to return start to finish
				result.reverse();
			}
			else // not the destination
			{
				// find which nearby nodes are walkable
				myNeighbours = Neighbours(myNode.x, myNode.y);
				// test each one that hasn't been tried already
				for(i = 0, j = myNeighbours.length; i < j; i++)
				{
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value])
					{
						// estimated cost of this particular route so far
						myPath.f = myNode.g + distanceFunction(myNeighbours[i], myNode);
						// estimated cost of entire guessed route to the destination
						myPath.g = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
						// remember this new path for testing above
						Open.push(myPath);
						// mark this node in the world graph as visited
						AStar[myPath.value] = true;
					}
				}
				// remember this route as having no more untested options
				// Closed.push(myNode); // original
				// OPTIMIZED OUT CLOSED LIST
			}
		} // keep iterating until the Open list is empty

		return result;
	}

	function isXYinPath(x,y,path) {
		if (!path) return false;
		for (var i=0; i<path.length; i++) {
			if (path[i][0]==x && path[i][1]==y)
				return true; // found
		}
		return false; // not found
	}

	// actually calculate the a-star path!
	// this returns an array of coordinates
	// that is empty if no path is possible
    return calculatePath();

} // end of findPath() function
