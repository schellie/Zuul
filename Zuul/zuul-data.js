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

var data = {
	rooms: [
	    [1, 'Big room'],
	    [2, 'Winding stairs'],
	    [3, 'Cellar'],
        [4, 'Market square'],
        [5, 'East gates'],
        [6, 'Storage room'],
	    [7, 'Outside gate']
	],
	exits: [ // from, to, command, condition
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
	items: [ // name, message (status0), initial room, optional: fixed room# (or -1), list of properties
	    ['keys', ['a set of keys'], 1, 'do:lock'],
	    ['axe', ['a giant axe'], 6],
	    ['book', ['a dwarvish book'], 3],
	    ['gold', ['a bar of gold'], 0, 'has:treasure'],
	    ['gate', ['a gate with solid iron bars', 'an unlocked iron gate'], 5, 7, 'has:lock'],
	    ['lamp', ['a brass lamp', 'a lit brass lamp'], 2, 'has:light'],
	    ['database', ['fake item, used for debugging only'], 0]
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
	    ['is', 'lamp', 'light', 'lantern'],
	    ['do', 'take', 'get', 'carry', 'keep', 'catch', 'steal', 'capture', 'tote'],
	    ['do', 'drop', 'release', 'free', 'discard', 'dump'],
	    ['do', 'open', 'unlock'],
	    ['do', 'close', 'lock'],
	    ['do', 'on'],
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
	    //Take, 20=nothing here, 21=lots of items, 22=have already, 23=item not present
	    //      24=item fixed, 25=carry too much, 26=taken
	    [20, 'There\'s nothing here to take.'],
	    [21, 'Please be more specific.'],
	    [22, 'You are already carrying it.'],
	    [23, 'No %s here.'],
	    [24, 'The %s cannot be moved.'],
	    [25, 'Your bag is full.'],
	    [26, '%s taken.'],
	    //Drop, 30=carry nothing, 31=not carrying item, 32=dropped
	    [30, 'You don\'t carry anything.'],
	    [31, 'You\'re not carrying the %s'],
	    [32, '%s dropped.'],
	    //Unlock, 35=no item given, 36=lots of items, 37=item not present, 
	    //        38=wrong property, 39=no keys, 40=unlocked
	    [35, 'There is nothing here with a lock!'],
	    [36, 'I don\'t which one to take ...'],
	    [37, 'I see no %s here.'],
	    [38, '%s has no locked.'],
	    [39, 'You don\'t have keys.'],
	    [40, 'Unlocked the %s.']
	    
	]
};
