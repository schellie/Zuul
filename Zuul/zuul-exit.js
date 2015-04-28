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
	/**
	 * Check whether travel condition are met
	 * @returns {Number} 1:ok, -1:no option, -2:blocked
	 */
	checkCondition: function() {
		console.log('condition: '+ this.condition);
		if (this.condition == 1) return 1;
		var p = this.condition.toString().split(':');
		if (p.length > 1) {
			var it = findItemByName(p[0]);
			if(it.getStatus() ==  p[1]) return 1; else return -2; // blocked
		}
		return -1;
	}
};
