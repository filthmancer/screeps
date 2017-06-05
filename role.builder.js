var def = require("creep.default");

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 collect');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            //if(targets.length) {
                if(creep.build(targets) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets, {visualizePathStyle: {stroke: '#ff6464'}});
                    creep.memory.target = targets.id;
                }
           // }
	    }
	    else {
	        if(!def.GrabResources(creep, true))
             def.Mine(creep);
	    }
	}
};

module.exports = roleBuilder;