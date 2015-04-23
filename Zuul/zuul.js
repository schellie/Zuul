/**
 * 
 */
var display,
	rooms = [],
	items = [],
	actions = [],
	vocabulary = [];

var player = {
    current: 1,
    maxItems: 3,
    inventory: [],
    lastInput: [],
    newInput: function(line) { this.lastInput = line.match(/\S+/g) || []; write(line, true); },
    getVerb: function() { return vocabulary[(this.lastInput[0] || '')]; },
    getItem: function() { return vocabulary[(this.lastInput[1] || '')]; },
    move: function(nw) { this.current = nw; },
    getLoc: function() { return this.current; },
    holding: function() { return this.inventory.length; },
    toting: function(i) { return this.inventory.indexOf(i) != -1; },
    do_take: function(i) {
    	var here = rooms[this.current].getItems();
    	i = i || -1; // when i==0, it will be false, so -1
    	if (!here.length) return 'There\'s nothing here'; // i is array
    	if (this.holding() == this.maxItems) return 'Your bag is full'; // carrying the limit
    	if (i > 0 && !rooms[this.current].here(i)) return 'No ' + items[i].getName() + ' here.';
   		if (i <= 0 && here.length > 1) return 'Please be more specific.'; // nothing specified & more items here
   		if (here.length == 1) i = here[0]; // point to the one item
   		// now we can take ...
		rooms[this.current].take(i); 
		this.inventory.push(i); // we push the reffered item
		return items[i].getName().toProperCase() + ' taken.';
    },
    do_drop: function() {
    	if (this.holding() === 0) return 'You don\'t carry anything';
    	else {
    		var s = '';
    		for (var i in this.inventory) {
    			//var ref = items.indexOf(this.inventory[i]); // get a reference for this item
    			rooms[this.current].drop(this.inventory[i]);
    			s += items[this.inventory[i]].getName().toProperCase() + ' dropped.\n';
    		}
    		// clear inventory
    		this.inventory = [];
    		return s;
    	}
    },
    do_inventory: function () {
    	var s = (this.inventory.length > 0) ? 'You hold:\n' : 'You don\'t hold anything\n';
        this.inventory.forEach(function (e, i) {
            s += '- ' + items[e].show() + '\n';
        });
        return s.slice(0, -1);
    },
    do_look: function () {
    	return rooms[this.getLoc()].look();
    }
};

String.prototype.toProperCase = function() {
	return this.substr(0, 1).toUpperCase() + this.substr(1);
};

function write(s, noprompt) {
	noprompt = (noprompt === 'undefined')?false:noprompt;
	display.innerHTML += s + '\n' + (noprompt?'':'> ');
	display.scrollTop = display.scrollHeight;
}

function Act(target, cmd) {
    this.target = target;
    this.cmd = cmd;
}

function Item(name, description) {
	//room = room || 0;
	this.name = name;
	this.status = 0;
	this.message = [description];
	//var index = items.length;
	//vocabulary[name] = 200 + index; // add to vocabulary
	//if (room) rooms[room].drop(index); // drop in room
}
Item.prototype = {
	constructor: Item,
	getName: function() { return this.name; },
	addStatus: function(m) { this.message.push(m); },
	show: function() { return this.message[this.status]; },
	look: function() { return 'There is ' + this.show() + ' here.'; },
};

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
			if (this.exits[e].command == d) return this.exits[e].target;
		}
		return -1;
	},
	look: function() {
		var s = this.name + '\n';
		this.items.forEach(function (e, i) { s += items[e].look() + '\n'; });
		s += 'Valid exits: ';
		this.exits.forEach(function (e, i) { s += e.command + ', '; });
		return s.slice(0, -2);
	}
};

function Exit(target, command, condition) {
	this.target = target;
	this.command = command;
	this.condition = condition;
}

function doAction(a, it) {
	atype = actions[a][0];
	console.log(atype);
	if (atype == 'go') {
	    var cl = rooms[player.loc()];
	    var nl = cl.move(actions[a][1]);
	    if (nl == -1) write('No possible exit');
	    else {
	        player.move(nl);
	        write(rooms[player.loc()].look());
	    }
	}
	else if (atype == 'do') {
		write(player['do_'+actions[a][1]](it));
		//write('Sorry, don\'t know how');
	}
	else write('OK');

}

function processCommand() {
	player.newInput(command.value);
	command.value = '';
	command.focus();
	
	var action = player.getVerb();
	if (!action) write('I don\'t know that word');
	else {
		doAction(action, player.getItem());
	}
}

function find(name) {
	return function (element) {
		if (element.name == name) return true; else return false;
	};
}

function init() {
	var count = 0;
	
	display = document.getElementById("display");
	command = document.getElementById("command");
    // Install command line listener
    command.onkeypress = function(event) {
    	if (event.keyCode == 13) processCommand();
    };
	
    rooms[0] = new Room('lingo');
	for (count in database.rooms) {
		rooms[database.rooms[count][0]] = new Room(database.rooms[count][1]);
	}
	
	for (count in database.exits) {
		rooms[database.exits[count][0]].addExit( new Exit(
				database.exits[count][1],
				database.exits[count][2],
				database.exits[count][3] || 0
		));
	}
	
	len = database.words.length;
	for (count in database.words) { 
		actions[+count + 1] = [database.words[count][0], database.words[count][1]];
		vocabulary[database.words[count][1]] = +count + 1; // do not start at 0
		var syn = database.words[count].slice(2);
		for (var s in syn) vocabulary[syn[s]] = +count + 1;	
	}
	
	items.push( new Item('', '') );  // items 0 is not to be used (tests go wrong ...)
	for (count in database.items) {
		items.push( new Item(database.items[count][0], database.items[count][1]) );
		rooms[database.items[count][2]].drop(+count+1); // drop in room
	}
	
//    console.log(rooms);
//    console.log(items);
//    console.log(actions);
//    console.log(vocabulary);
	
	
// +---+   +---+         
// | 1 <---> 2 |         
// +---+   +-^-+         
//   |       |           
// +-v-+   +-v-+   +---+ 
// | 3 <---> 4 <---> 5 | 
// +---+   +-^-+   +---+ 
//	         |           
//	       +-v-+         
//	       | 6 |         
//	       +---+ 

    write(rooms[player.getLoc()].look());
	command.value = '';
	//Give focus to command line.
	command.focus();
}

