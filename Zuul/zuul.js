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
var main = {
	display: {},
	command: {},
	rooms: [],
	items: [],
	actions: [],
	vocabulary: [],
	write: function(s, noprompt) {
		noprompt = (noprompt === 'undefined')?false:noprompt;
		this.display.innerHTML += s + '\n' + (noprompt?'':'> ');
		this.display.scrollTop = this.display.scrollHeight;
	},
	find: function(name) { return function (e) { if (e.name == name) return true; else return false; }; },
	doAction: function(a, it) {
		// a: -1, >0 it: -1, undefined, >0
		if (a == -1) this.write('What?');
		else {
			var atype = this.actions[a][0];
			if (atype == 'go') this.write(player.move(this.actions[a][1]));
			else if (atype == 'do') { // differentiate between illegal item and no item
				if (!it) this.write('Sorry, I don\'t know how');
				else {
					var is = (it == -1) ? -1 : this.actions[it];
					is = is[2] || -1;
					this.write(player['do_' + this.actions[a][1]](is) );
				}
			}
			else this.write('OK');
		}

	},
	init_db: function() {
		var count;
		// initialize references to elements on HTML page
		this.display = document.getElementById("display");
		this.command = document.getElementById("command");
	    // Install command line listener
	    this.command.onkeypress = function(event) { if (event.keyCode == 13) player.processCommand(); };
		// fill the rooms
	    this.rooms[0] = new Room('lingo');
		for (count in database.rooms) {
			this.rooms[database.rooms[count][0]] = new Room(database.rooms[count][1]);
		}
		// add the exits
		for (count in database.exits) {
			this.rooms[database.exits[count][0]].addExit( new Exit(
					database.exits[count][1],
					database.exits[count][2],
					database.exits[count][3] || 0
			));
		}
		// setup the vocabulary
		for (count in database.words) { 
			// this will define the action to take on a given number (id)
			this.actions[+count + 1] = [database.words[count][0], database.words[count][1]];
			// at least one word will get a reference to the action above
			this.vocabulary[database.words[count][1]] = +count + 1; // do not start at 0
			// now, add synonyms to the word above (same ref to action)
			var syn = database.words[count].slice(2);
			for (var s in syn) this.vocabulary[syn[s]] = +count + 1;	
		}
		// make a list with items and move the item to the correct initial location
		this.items.push( new Item('', '') );  // items 0 is not to be used (tests go wrong ...)
		for (count in database.items) {
			this.items.push( new Item(database.items[count][0], database.items[count][1]) );
			this.rooms[database.items[count][2]].drop(+count+1); // drop in room
			var fixed = database.items[count][3] || false;
			if (fixed) {
				this.items[+count+1].setFixed();
				if (fixed > 0) this.rooms[fixed].drop(+count+1);
			}
			// create ref. in actions, and add if it should exist
			var a = this.vocabulary[this.items[+count+1].name];
			if (a === undefined) {
				console.log('item added to vocabulary: ' + this.items[+count+1].name);
				this.actions.push(["is", this.items[+count+1].name]);
				this.vocabulary[this.items[+count+1].name] = this.actions.length - 1;
				a = this.actions.length - 1;
			}
			this.actions[a].push(+count+1);
		}
		for (count in database.itemstates) {
			console.log(database.itemstates[count][0]);
			//this.items[this.action[this.vocabulary[database.itemstates[count][0]]][2]].addStatus(database.itemstates[count][1]);
		}
		console.log(this.rooms);
		console.log(this.items);
		console.log(this.actions);
		console.log(this.vocabulary);
		this.start(); // ok, now go
	},
	start: function() {
		this.write(player.move(1)); // start player in room 1, this will also generate a description of the room
		this.command.value = ''; // clear command line
		this.command.focus(); // and give focus to command line
	}
};


/**
 * Room class, defines properties and methods for a room/location in the game
 * Room 0 is considered to be death (compares to 0 are sometimes not as expected ...)
 */
function Room(name) {
    this.name = name;
    this.exits = [];
    this.items = [];
}
Room.prototype = {
	constructor: Room,
	addExit: function(exit) { this.exits.push(exit); },
	getItems: function() { return this.items; },
	drop: function(i) { this.items.push(i); },
	take: function(i) { this.items.splice(this.items.indexOf(i), 1); },
	here: function(i) { return this.items.indexOf(i) >= 0; },
	move: function(d) {
		for (var e in this.exits) {
			if (this.exits[e].command == d) 
				if (this.exits[e].checkCondition()) return this.exits[e].target;
		}
		return -1;
	},
	look: function() {
		var s = this.name + '\n';
		this.items.forEach(function (e, i) { s += main.items[e].look() + '\n'; });
		s += 'Valid exits: ';
		this.exits.forEach(function (e, i) { s += e.command + ', '; });
		return s.slice(0, -2);
	}
};

/**
 * Exit class, exits are static and need only to be added to Rooms
 * Maybe a method 'validate conditions' is needed (part of move?)
 */
function Exit(target, command, condition) {
	this.target = target;
	this.command = command;
	this.condition = condition;
}
Exit.prototype = {
	constructor: Exit,
	checkCondition: function() {
		if (this.condition == 1) return true;
		return true;
	}
};


/**
 * Item class, properties and methods of various items present in the game
 * Item 0 is not used
 */
function Item(name, description) {
	this.name = name;
	this.status = 0;
	this.message = [description];
	this.fixed = false;
}
Item.prototype = {
	constructor: Item,
	getName: function() { return this.name; },
	addStatus: function(m) { this.message.push(m); },
	show: function() { return this.message[this.status]; },
	look: function() { return 'There is ' + this.show() + ' here.'; },
	isFixed: function() { return this.fixed; },
	setFixed: function() {  this.fixed = true; }
};



