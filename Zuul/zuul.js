/**
 * 
 */
var display,
	locations = [],
	items = [],
	directions = [],
	vocabulary = [];

var player = {
    current: 1,
    maxItems: 3,
    inventory: [],
    move: function(nw) {
        this.current = nw;
    },
    loc: function() { return this.current; },
    holding: function() { return this.inventory.length; },
    toting: function(i) { return this.inventory.indexOf(i) != -1; },
    take: function() {
    	var i = locations[this.current].getItems();
    	if (i.length > 0) {
    		var ref = items.indexOf(i[0]); // get a reference for this item
    		if (this.holding() < this.maxItems) {
    			locations[this.current].take(i[0]); // because i[0] will be destroyed now ...
    			this.inventory.push(items[ref]); // we push the reffered item
    			write(items[ref].getName().toProperCase() + ' taken.');
    		}
    		else write('Your bag is full');
    	} else write('There\s nothing here');
    },
    drop: function() {
    	if (this.holding() == 0) write('You don\'t carry anything');
    	else {
    		for (var i in this.inventory) {
    			locations[this.current].drop(this.inventory[i]);
    			write(this.inventory[i].getName().toProperCase() + ' dropped.', true);
    		}
    		write('', false);
    		// clear inventory
    		this.inventory = [];
    	}
    },
    takeInventory: function () {
    	var s = (this.inventory.length > 0) ? 'You hold:\n' : 'You don\'t hold anything\n';
        this.inventory.forEach(function (e, i) {
            s += '- ' + e.show() + '\n';
        });
        write(s.slice(0, -1));
    }
};

String.prototype.toProperCase = function() {
	return this.substr(0, 1).toUpperCase() + this.substr(1);
};

function write(s, noprompt) {
	noprompt = (noprompt === 'undefined')?false:noprompt;
	display.innerHTML += s + '\n' + (noprompt?'':'> ');
	display.scrollTop = display.scrollHeight;
};

function Act(target, cmd) {
    this.target = target;
    this.cmd = cmd;
};

function Item(name, description) {
	this.name = name;
	this.status = 0;
	this.message = [description];
}
Item.prototype.getName = function() {
	return this.name;
};
Item.prototype.addStatus = function(m) {
	this.message.push(m);
};
Item.prototype.show = function() {
	return this.message[this.status];
};
Item.prototype.look = function() {
	return 'There is ' + this.show() + ' here.';
};


function Location(name) {
    this.name = name;
    this.exits = [];
    this.items = [];
}
Location.prototype.addExit = function(exit) {
    this.exits.push(exit);
};
Location.prototype.look = function() {
    var s = this.name + '\n';
    this.items.forEach(function (e, i) {
        s += e.look() + '\n';
    });
    s += 'Valid exits: ';
    this.exits.forEach(function (e, i) {
         s += directions[e.command] + ', ';
    });
    return s.slice(0, -2);
};
Location.prototype.move = function(d) {
    for (var e in this.exits) {
    	if (this.exits[e].command == d) return this.exits[e].target;
    }
    return -1;
};
Location.prototype.drop = function(i) {
	this.items.push(i);
};
Location.prototype.take = function(i) {
	this.items.splice(this.items.indexOf(i), 1);
};
Location.prototype.getItems = function() {
	return this.items;
};

function Exit(cmd, target) {
    this.command = cmd;
    this.target = target;
}

function doAction(a) {
	atype = a/100>>0;
	switch (atype) {
	case 0:
	    var cl = locations[player.loc()];
	    var nl = cl.move(a);
	    if (nl == -1) write('No possible exit');
	    else {
	        player.move(nl);
	        write(locations[player.loc()].look());
	    }
	    break;
	case 1:
		switch (a%100) {
		case 1:
			player.take(); break;
		case 2:
			player.drop(); break;
		case 8:
			write(locations[player.loc()].look()); break;
		case 9:
			player.takeInventory(); break;
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
	var text = command.value;
	var words = text.match(/\S+/g) || [];
	// echo command
	write(text, true);
	command.value = '';
	//Give focus to command line.
	command.focus();
	
	var action = vocabulary[words[0]];
	if (!action) write('I don\'t know that word');
	else {
		doAction(action);
	}
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
	locations = [
         new Location('dead'),
         new Location('1: Big room'),
         new Location('2: Winding stairs'),
         new Location('3: Cellar'),
         new Location('4: Market square'),
         new Location('5: West gates'),
         new Location('6: Storage room')
     ];
     locations[1].addExit( new Exit(12, 2) );
     locations[1].addExit( new Exit(16, 3) );
     locations[2].addExit( new Exit(14, 1) );
     locations[2].addExit( new Exit(13, 4) );
     locations[3].addExit( new Exit(12, 4) );
     locations[4].addExit( new Exit(14, 3) );
     locations[4].addExit( new Exit(11, 2) );
     locations[4].addExit( new Exit(12, 5) );
     locations[4].addExit( new Exit(13, 6) );
     locations[5].addExit( new Exit(14, 4) );
     locations[6].addExit( new Exit(11, 4) );
     
     // 11=n, 12=e, 13=s, 14=w
     directions[11] = 'north';
     directions[12] = 'east';
     directions[13] = 'south';
     directions[14] = 'west';
     directions[15] = 'up';
     directions[16] = 'down';
     
     items = [
         new Item('keys', 'a set of keys'),
         new Item('axe', 'a giant axe'),
         new Item('book', 'a dwarvish book')
     ];
     
     locations[1].drop(items[0]);
     locations[6].drop(items[1]);
     locations[3].drop(items[2]);
     
     vocabulary['north'] = 11;
     vocabulary['n'] = 11;
     vocabulary['south'] = 13;
     vocabulary['s'] = 13;
     vocabulary['east'] = 12;     
     vocabulary['e'] = 12;
     vocabulary['west'] = 14;
     vocabulary['w'] = 14;
     vocabulary['up'] = 15;
     vocabulary['u'] = 15;
     vocabulary['down'] = 16;
     vocabulary['d'] = 16;

     vocabulary['get'] = 101;
     vocabulary['take'] = 101;
     vocabulary['tote'] = 101;
     vocabulary['pick'] = 101;
     vocabulary['drop'] = 102;
     vocabulary['dump'] = 102;
     vocabulary['leave'] = 102;
     vocabulary['look'] = 108;
     vocabulary['show'] = 108;
     vocabulary['invent'] = 109;
     vocabulary['inventory'] = 109;

     
     write(locations[player.loc()].look());
 	command.value = '';
	//Give focus to command line.
	command.focus();
}


/*
// Remove an item by value in an Array object
var arr = ['a', 'b', 'c', 'd'];
var pos = arr.indexOf( 'c' );
pos > -1 && arr.splice( pos, 1 );
Print( arr ); // prints: a,b,d

// Multiple-value returns
function f() { return [1, 2]; }
var [a, b] = f();
Print( a + ' ' + b ); // prints: 1 2

// Change current object (this) of a function call
function test(arg) { Print( this[0]+' '+this[1]+' '+arg ); }
var arr = ['foo', 'bar'];
test.call(arr, 'toto'); // prints: foo bar toto

// swap two variables
var a = 1;
var b = 2;
[a,b] = [b,a];

// Iterate on values
for each ( var i in [3,23,4] ) Print(i)


*/
