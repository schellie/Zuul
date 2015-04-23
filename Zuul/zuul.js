/**
 * 
 */
var display,
	rooms = [],
	items = [],
	directions = [],
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
    loc: function() { return this.current; },
    holding: function() { return this.inventory.length; },
    toting: function(i) { return this.inventory.indexOf(i) != -1; },
    take: function(i) {
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
    drop: function() {
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
    takeInventory: function () {
    	var s = (this.inventory.length > 0) ? 'You hold:\n' : 'You don\'t hold anything\n';
        this.inventory.forEach(function (e, i) {
            s += '- ' + items[e].show() + '\n';
        });
        return s.slice(0, -1);
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

function Item(name, description, room) {
	room = room || 0;
	this.name = name;
	this.status = 0;
	this.message = [description];
	var index = items.length;
	vocabulary[name] = 200 + index; // add to vocabulary
	if (room) rooms[room].drop(index); // drop in room
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
		this.exits.forEach(function (e, i) { s += directions[e.command] + ', '; });
		return s.slice(0, -2);
	}
};

function Exit(cmd, target) {
    this.command = cmd;
    this.target = target;
}

function doAction(a, it) {
	atype = a/100>>0;
	switch (atype) {
	case 0:
	    var cl = rooms[player.loc()];
	    var nl = cl.move(a);
	    if (nl == -1) write('No possible exit');
	    else {
	        player.move(nl);
	        write(rooms[player.loc()].look());
	    }
	    break;
	case 1:
		switch (a%100) {
		case 1:
			write(player.take(it%100)); break;
		case 2:
			write(player.drop(it%100)); break;
		case 8:
			write(rooms[player.loc()].look(it%100)); break;
		case 9:
			write(player.takeInventory()); break;
		default:
			write('Sorry, don\'t know how');
		}
		break;
	case 2:
		write('OK');
		break;
		
	}
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

	display = document.getElementById("display");
	command = document.getElementById("command");
    // Install command line listener
    command.onkeypress = function(event) {
    	if (event.keyCode == 13) processCommand();
    };
	
	
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
	rooms = [
         new Room('dead'),
         new Room('1: Big room'),
         new Room('2: Winding stairs'),
         new Room('3: Cellar'),
         new Room('4: Market square'),
         new Room('5: West gates'),
         new Room('6: Storage room')
    ];
    rooms[1].addExit( new Exit(12, 2) );
    rooms[1].addExit( new Exit(16, 3) );
    rooms[2].addExit( new Exit(14, 1) );
    rooms[2].addExit( new Exit(13, 4) );
    rooms[3].addExit( new Exit(12, 4) );
    rooms[4].addExit( new Exit(14, 3) );
    rooms[4].addExit( new Exit(11, 2) );
    rooms[4].addExit( new Exit(12, 5) );
    rooms[4].addExit( new Exit(13, 6) );
    rooms[5].addExit( new Exit(14, 4) );
    rooms[6].addExit( new Exit(11, 4) );
    
    // 11=n, 12=e, 13=s, 14=w
    directions[11] = 'north';
    directions[12] = 'east';
    directions[13] = 'south';
    directions[14] = 'west';
    directions[15] = 'up';
    directions[16] = 'down';
    
    items.push( new Item('', '') );  // items 0 is not to be used (tests go wrong ...)
    items.push( new Item('keys', 'a set of keys', 1) ); 
    items.push( new Item('axe', 'a giant axe', 6) );
    items.push( new Item('book', 'a dwarvish book', 3) );
    items.push( new Item('gold', 'a bar of gold') );

    vocabulary.north = 11;
    vocabulary.n = 11;
    vocabulary.south = 13;
    vocabulary.s = 13;
    vocabulary.east = 12;     
    vocabulary.e = 12;
    vocabulary.west = 14;
    vocabulary.w = 14;
    vocabulary.up = 15;
    vocabulary.u = 15;
    vocabulary.down = 16;
    vocabulary.d = 16;

    vocabulary.get = 101;
    vocabulary.take = 101;
    vocabulary.tote = 101;
    vocabulary.pick = 101;
    vocabulary.drop = 102;
    vocabulary.dump = 102;
    vocabulary.leave = 102;
    vocabulary.look = 108;
    vocabulary.show = 108;
    vocabulary.invent = 109;
    vocabulary.inventory = 109;

    write(rooms[player.loc()].look());
	command.value = '';
	//Give focus to command line.
	command.focus();
}

