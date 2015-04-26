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
	    ['gate', 'a gate with solid iron bars', 5, 7],
	    ['on', 'lights on', 0],
	    ['off', 'lights off', 0],
	    ['database', 'fake item, used for debugging only', 0]
	],
	itemstates: [
	    ['gate', 'an unlocked iron gate']
	],
	words: [
	    ['go', 'north', 'n'],
	    ['go', 'south', 's'],
	    ['go', 'east','e'],
	    ['go', 'west', 'w'],
	    ['go', 'northeast', 'ne'],
	    ['go', 'northwest', 'nw'],
	    ['go', 'southeast', 'se'],
	    ['go', 'southwest', 'sw'],    
	    ['go', 'down', 'd', 'downward', 'downwards'],
	    ['go', 'up', 'u', 'upward', 'upwards'],
	    ['go', 'in', 'inward', 'inside', 'enter'],
	    ['go', 'out', 'outside', 'exit', 'leave'],	    
	    ['is', 'keys', 'key'],
	    ['is', 'axe'],
	    ['is', 'gold', 'bar'],
	    ['is', 'book'],
	    ['is', 'database'],
	    ['is', 'gate', 'grate', 'bars'],
	    ['do', 'take', 'get', 'carry', 'keep', 'catch', 'steal', 'capture', 'tote'],
	    ['do', 'drop', 'release', 'free', 'discard', 'dump'],
	    ['do', 'open', 'unlock'],
	    ['do', 'close', 'lock'],
	    ['do', 'on', 'light', 'lamp', 'lantern'],
	    ['do', 'off', 'extinguish' ],
	    ['do', 'say', 'chant', 'sing', 'utter', 'mumble', 'talk'],
	    ['do', 'wave', 'shake', 'swing'],
	    ['do', 'calm', 'tame', 'soften', 'subdue', 'placate', 'ease'],
	    ['do', 'go', 'walk', 'run', 'travel', 'proceed', 'continue', 'explore', 'goto', 'follow', 'turn'],
	    ['do', 'attack', 'kill', 'fight', 'hit', 'strike'],
	    ['do', 'eat', 'devour', 'swallow'],
	    ['do', 'drink'],
	    ['do', 'throw', 'toss'],
	    ['do', 'find', 'where'],
	    ['do', 'rub'],
	    ['do', 'fill'],
	    ['do', 'blast', 'detonate', 'ignite', 'blowup'],
	    ['do', 'score'],
	    ['do', 'brief'],
	    ['do', 'read', 'peruse'],
	    ['do', 'break', 'shatter', 'smash'],
	    ['do', 'inventory'],
	    ['do', 'look', 'examine', 'touch', 'describe'],
	    ['do', 'log'],
	    ['do', 'quit', 'stop']
	],
	messages: [
        [1, 'OK'],       
	    //Logging, 2=on, 3=off
	    [2, 'Logging is now enabled.'],
	    [3, 'Logging is now disabled.'],
	    //Main responses, 4-6=empty input/unknown word
	    [4, 'What?'],
	    [5, 'I don\'t understand that!'],
	    [6, 'I don\'t know that word.'],
	    //Invalid item (cannot be manipulated)
	    [7, 'Sorry, I don\'t know how to do that.'],
	    //Known item, but no action specified and not present here
	    [8, 'I see no %s here.'],
	    //Known item, but no action specified and present
	    [9, 'What do you want to do with the %s?'],
	    //Travel, 10=no exit, 11=conditions not met
	    [10, 'There is no way to go there.'],
	    [11, 'That exit is blocked.'],
	]
};
