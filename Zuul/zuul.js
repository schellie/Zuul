/**
 * Zuul
 */

/**
 * Extend String.prototype with proper case: capitalize first character of sentence (string)
 * @return String with first character in uppercase
 */
String.prototype.toProperCase = function() {
	return this.substr(0, 1).toUpperCase() + this.substr(1);
};
/**
 * Returns the index of the value if it exists, or undefined if not
 */
Object.defineProperty(Object.prototype, "keyOf", { 
    value: function(value) {
        for (var key in this) if (this[key] == value) return key;
        return undefined;
    }
});

/**
 * Holds 'global' variables & (utility) functions 
 */
var zuul = {
	display: {},
	command: {},
	logging: true,
	rooms: [],
	items: [],
	actions: [],
	vocabulary: [],
	messages: [],
	setDisplay: function(display) { this.display = display; },
	putDisplay: function(s, noprompt) {
		noprompt = (noprompt === 'undefined')?false:noprompt;
		if (s && s.length > 0) this.display.innerHTML += s.toProperCase() + '\n' + (noprompt?'':'> ');
		this.display.scrollTop = this.display.scrollHeight;
	},
	setCommand: function(command) { this.command = command; },
	getCommand: function() { 
		var cmd = this.command.value; 
		this.clearCommand();
		return cmd;
	},
	setListener: function(callback)	{ 
		this.command.onkeypress = function(event) { 
			if (event.keyCode == 13) callback(); 
		}; 
	},
	clearCommand: function() { 
		this.command.value = ''; // clear command line
		this.command.focus(); // and give focus to command line
	},
	toggleLogging: function() { this.logging = !this.logging; return this.logging ? speak(2) : speak(3); },
	isLogging: function() { return this.logging; }
};



function speak(prm) {
	if (typeof(prm) == 'number') return zuul.putDisplay(zuul.messages[prm], false);
	else if (typeof(prm) == 'string') return zuul.putDisplay(prm, false);
	else {
		// TODO: replace global with array
		return zuul.putDisplay(zuul.messages[prm[0]].replace(/%s/, prm[1]), false);
	}
}

function speakUnknown() {
	if (percent(20)) speak(4);
	else if (percent(30)) speak(5);
	else speak(6);
	return;
}
	
function log(s) { 
	if (zuul.isLogging()) console.log(s); 
}
	
function find(name) { 
	return function (e) { if (e.name == name) return true; else return false; }; 
}

function findItemByName(name) {
	for (var i in zuul.items) {
		if (zuul.items[i].getName() == name) return zuul.items[i];
	}
	return {};
}

function findItemByProp(p) {
	var res = [];
	for (var i in zuul.items) {
		if (zuul.items[i].hasProp(p)) res.push(zuul.items[i]);
	}
    return res;
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function percent(n) { 
	return 100*Math.random() < n; 
}

function doAction(vb, it) {
	var type;
	log('verb:'+vb+', item:'+it);
	// vb, it: -1 not found, =0 no word, >0 word number
	if (vb <= 0) return speakUnknown();
	type = zuul.actions[vb][0];
	if (type == 'go') return speak(player.move(zuul.actions[vb][1]));
	if (type == 'do') {
		// if no item we pass on
		if (it === 0) return speak(player['do_' + zuul.actions[vb][1]](0));
		// check if valid item
		if (it != -1 && zuul.actions[it][0] == 'is') 
			return speak(player['do_' + zuul.actions[vb][1]](findItemByName(zuul.actions[it][1])));
		return speak(7);
	}
	if (type == 'is') {
		// if no item we don't know what to do
		if (it === 0) {
			if (!player.here(zuul.actions[vb][2])) // item not present
				return speak(8, zuul.actions[vb][1]);
			else return speak(9, zuul.actions[vb][1]);
		}
		// if 2nd is action we can do something
		if (it != -1 && zuul.actions[it][0] == 'do') 
			return speak(player['do_' + zuul.actions[it][1]](zuul.actions[vb][2]));
		return speak(1);
	}
}

function init_data() {
	var count = 0, s = 0;
	
	// initialize references to elements on HTML page
	zuul.setDisplay(document.getElementById("display"));
	zuul.setCommand(document.getElementById("command"));
    // Install command line listener
	zuul.setListener(player.processCommand);
	
	// read in the messages
	for (count in data.messages) {
		zuul.messages[data.messages[count][0]] = data.messages[count][1];
	}	    
    // fill the rooms
    zuul.rooms[0] = new Room('lingo');
	for (count in data.rooms) {
		zuul.rooms[data.rooms[count][0]] = new Room(data.rooms[count][1]);
	}
	// add the exits
	for (count in data.exits) {
		zuul.rooms[data.exits[count][0]].addExit( new Exit(
				data.exits[count][1],
				data.exits[count][2],
				data.exits[count][3] || 0
		));
	}
	// setup the vocabulary
	// 'word'->id->action[type:do,go,is][action to call][optional index to items]
	// actions
	for (count in data.words) { 
		// this will define the action to take on a given number (id)
		zuul.actions[+count + 1] = [data.words[count][0], data.words[count][1]];
		// at least one word will get a reference to the action above
		zuul.vocabulary[data.words[count][1]] = +count + 1; // do not start at 0
		// now, add synonyms to the word above (same ref to action)
		var syn = data.words[count].slice(2);
		for (s in syn) zuul.vocabulary[syn[s]] = +count + 1;	
	}
	// make a list with items and move the item to the correct initial location
	zuul.items.push( new Item('', '') );  // items 0 is not to be used (tests go wrong ...)
	for (count in data.items) {
		var name = data.items[count].shift();
		var msg = data.items[count].shift();
		var room = data.items[count].shift();
		var fixed = typeof(data.items[count][0])==='number'?data.items[count].shift():0;
		var props = data.items[count];
				
		var item = new Item(name);
		// status array
		for (s in msg) item.addStatus(msg[s]);
		
		//add to global array
		zuul.items.push(item);
		// put item in room(s)
		zuul.rooms[room].drop(item);
		// fixed: -1 fixed in place, > 0 second room, 0 not present (not fixed) 
		if (fixed) item.setFixed();
		if (fixed > 0) zuul.rooms[fixed].drop(item);
		
		// add properties
		for (s in props) {
			var p = props[s].split(':');
			if (p[0] == 'has') item.addProp(p[1]);
			if (p[0] == 'do') item.addAbility(p[1]);
		}

		// create ref. in actions, and add if it shouldn't exist
		var a = zuul.vocabulary[item.getName()]; // find the item name in vocabulary
		if (a === undefined) { // item name is not there
			console.log('item added to vocabulary: ' + item.getName());
			zuul.actions.push(["is", item.getName()]);
			zuul.vocabulary[item.getName()] = zuul.actions.length - 1;
			a = zuul.actions.length - 1;
		}
		zuul.actions[a].push(item);
	}

	log(zuul.messages);
	log(zuul.rooms);
	log(zuul.items);
	log(zuul.actions);
	log(zuul.vocabulary);
	
	//log(findItemByProp('light'));
	
	
	
	start(); // ok, now go
}

function start() {
	// player will start in room 1
	player.setRoom(1);
	speak(player.do_look()); // generate a description of the room
	zuul.clearCommand();
}


