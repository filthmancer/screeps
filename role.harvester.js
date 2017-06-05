var def = require("creep.default");
var roleHarvester = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            def.Mine(creep);
        }
        else {
            def.TakeEnergyToTarget(creep, Game.spawns['Spawn1']);
        }
	}
};


module.exports = roleHarvester;