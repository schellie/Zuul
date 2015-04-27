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
	logging: true,
	rooms: [],
	items: [],
	actions: [],
	vocabulary: [],
	messages: [],
	write: function(s, noprompt) {
		noprompt = (noprompt === 'undefined')?false:noprompt;
		this.display.innerHTML += s.toProperCase() + '\n' + (noprompt?'':'> ');
		this.display.scrollTop = this.display.scrollHeight;
	},
	speak: function(prm) {
		if (typeof(prm) == 'number') return this.write(this.messages[prm], false);
		else if (typeof(prm) == 'string') return this.write(prm, false);
		else {
			// TODO: replace global with array
			return this.write(this.messages[prm[0]].replace(/%s/, prm[1]), false);
		}
	},
	speakUnknown: function() {
		if (this.percent(20)) this.speak(4);
		else if (this.percent(30)) this.speak(5);
		else this.speak(6);
		return;
	},
	log: function(s) { if (this.isLogging()) console.log(s); },
	find: function(name) { return function (e) { if (e.name == name) return true; else return false; }; },
	percent: function(n) { return 100*Math.random() < n; },
	toggleLogging: function() {
		this.logging = !this.logging;
		return this.logging ? this.speak(2) : this.speak(3);
	},
	isLogging: function() { return this.logging; },
	doAction: function(vb, it) {
		var type;
		// vb, it: -1 not found, =0 no word, >0 word number
		if (vb <= 0) return this.speakUnknown();
		type = this.actions[vb][0];
		if (type == 'go') return this.speak(player.move(this.actions[vb][1]));
		if (type == 'do') {
			// if no item we pass on
			if (it === 0) return this.speak(player['do_' + this.actions[vb][1]](0));
			// check if valid item
			if (it != -1 && this.actions[it][0] == 'is') 
				return this.speak(player['do_' + this.actions[vb][1]](this.actions[it][2]));
			return this.speak(7);
		}
		if (type == 'is') {
			// if no item we don't know what to do
			if (it === 0) {
				if (!player.here(this.actions[vb][2])) // item not present
					return this.speak(8, this.actions[vb][1]);
				else return this.speak(9, this.actions[vb][1]);
			}
			// if 2nd is action we can do something
			if (it != -1 && this.actions[it][0] == 'do') 
				return this.speak(player['do_' + this.actions[it][1]](this.actions[vb][2]));
			return speak(1);
		}

	},
	init_db: function() {
		var count = 0;
		// initialize references to elements on HTML page
		this.display = document.getElementById("display");
		this.command = document.getElementById("command");
	    // Install command line listener
	    this.command.onkeypress = function(event) { if (event.keyCode == 13) player.processCommand(); };
		// read in the messages
		for (count in database.messages) {
			this.messages[database.messages[count][0]] = database.messages[count][1];
		}	    
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
			// create ref. in actions, and add if it shouldn't exist
			var a = this.vocabulary[this.items[+count+1].name];
			if (a === undefined) {
				console.log('item added to vocabulary: ' + this.items[+count+1].name);
				this.actions.push(["is", this.items[+count+1].name]);
				this.vocabulary[this.items[+count+1].name] = this.actions.length - 1;
				a = this.actions.length - 1;
			}
			this.actions[a].push(+count+1);
		}
		// add various statuses to items
		for (count in database.itemstates) {
			var it = this.items.filter(this.find(database.itemstates[count][0]));
			if (it.length > 0) it[0].addStatus(database.itemstates[count][1]);
			else console.log(database.itemstates[count][0] + 'not found in items');
		}
		this.log(this.messages);
		this.log(this.rooms);
		this.log(this.items);
		this.log(this.actions);
		this.log(this.vocabulary);
		
		this.start(); // ok, now go
	},
	start: function() {
		// player will start in room 1
		player.setRoom(1);
		this.write(player.do_look()); // generate a description of the room
		this.command.value = ''; // clear command line
		this.command.focus(); // and give focus to command line
	}
};

