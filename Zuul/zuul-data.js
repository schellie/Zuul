// Layout
// +---+   +---+         
// | 1 <---> 2 |         
// +---+   +-^-+         
//   |       |           
// +-v-+   +-v-+   +---+   +---+ 
// | 3 <---> 4 <---> 5 <---> 7 | 
// +---+   +-^-+   +---+   +---+ 
//           |           
//         +-v-+         
//         | 6 |         
//         +---+ 

var database = {
	rooms: [
	    [1, 'Big room'],
	    [2, 'Winding stairs'],
	    [3, 'Cellar'],
        [4, 'Market square'],
        [5, 'West gates'],
        [6, 'Storage room'],
	    [7, 'Outside gate']
	],
	exits: [
		[1, 2, 'east', 1],
		[1, 3, 'down', 1],
		[2, 1, 'west', 1],
		[2, 4, 'south', 1],
		[3, 4, 'east', 1],
		[4, 3, 'west', 1],
		[4, 2, 'north', 1],
		[4, 5, 'east', 1],
		[4, 6, 'south', 1],
		[5, 4, 'west', 1],
		[5, 7, 'east', 'gate:1'],
		[6, 4, 'north', 1],
		[7, 5, 'west', 'gate:1']
	],
	items: [
	    ['keys', 'a set of keys', 1],
	    ['axe', 'a giant axe', 6],
	    ['book', 'a dwarvish book', 3],
	    ['gold', 'a bar of gold', 0],
	    ['gate', 'a gate with solid iron bars', 5, 7]
	],
	itemstates: [
	    ['gate', 'an open gate']
	],
	words: [
	    ['go', 'north', 'n'],
	    ['go', 'south', 's'],
	    ['go', 'east','e'],
	    ['go', 'west', 'w'],
	    ['go', 'down', 'd', 'downward', 'downwards'],
	    ['go', 'up', 'u', 'upward', 'upwards'],
	    ['is', 'keys', 'key'],
	    ['is', 'axe'],
	    ['is', 'gold', 'bar'],
	    ['is', 'book'],
	    ['is', 'gate', 'grate', 'bars'],
	    ['do', 'take', 'get', 'carry', 'keep', 'catch', 'steal', 'capture', 'tote'],
	    ['do', 'drop', 'release', 'free', 'discard', 'dump'],
	    ['do', 'inventory'],
	    ['do', 'look', 'examine', 'touch', 'describe']
	]
};
