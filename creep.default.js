/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.default');
 * mod.thing == 'a thing'; // true
 */

 var creepDefault = 
 {
    Mine:function(creep)
    {
        var source;
        if(creep.memory.source == null)
        {
            source = SourceEx.getEmptySource(creep);
            if(source == null) return false;
        }
        else
        {
            var s = Game.getObjectById(creep.memory.source);
            source = s;
            if(source.energy == 0)
            {
                creep.memory.source = null;
                return;
            }
        }
        
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#e10e0e'}});
        }
        if(creep.harvest(source) == ERR_NO_PATH)
        {
            creep.memory.source = null;
            return;
        }
    },
    GrabResources:function(creep, from_struct = false)
    {
        if(creep.memory.target != null)
        {
            var targ = Game.getObjectById(creep.memory.target);
            if(targ != null)
            {
                if(Game.creeps[targ.name] != null && targ.carry != null && targ.carry.energy == 0) creep.memory.target = null;
            }
        }
        if(creep.memory.target == null)
        {
            var t;
            if(from_struct)
            {
                t = creep.pos.findClosestByRange(FIND_STRUCTURES,
                {filter:function(d)
                    {
                       if(d.structureType == STRUCTURE_CONTAINER && d.store['energy'] > 0) return d;
                    }
                });
            }
            if(t == null)
            {
                t = creep.pos.findClosestByRange(FIND_MY_CREEPS, 
                {filter:function(d) 
                    {
                        if(d.memory.role == "miner" && d.carry.energy > 10) return d;
                        return null;
                    }
                });
                if(t == null) return false;
            }
            creep.memory.target = t.id;
       }


       if(creep.memory.target)
       {
            var targ = Game.getObjectById(creep.memory.target);
    
            if(targ == null)
            {
                creep.memory.target = null;
                return false;
            }
    
            if(Game.creeps[targ.name] != null)
            {
                if(targ.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                   creep.moveTo(targ, {visualizePathStyle: {stroke: '#eee000'}});
                   return true;
                }
            }
            else
            {
                if(creep.withdraw(targ, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                   creep.moveTo(targ, {visualizePathStyle: {stroke: '#eee000'}});
                   return true;
                }
            }
            
            return false;
        }
        return false;
    },
    TakeEnergyToTarget:function(creep, target = null)
    {
        if(target == null || (target == Game.spawns["Spawn1"] && target.energy >= 200))
        {
            var targets = creep.room.find(FIND_STRUCTURES, {
               filter: (structure) => {
                
                if((structure.structureType == STRUCTURE_EXTENSION 
                       || structure.structureType == STRUCTURE_SPAWN
                       || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity)
                    return structure;
                else if(structure.structureType == STRUCTURE_CONTAINER)
                {
                    return structure.store['energy'] < structure.storeCapacity;                   
                }
               }
           });
            if(targets.length > 0 && targets[0] != target) {
               target = targets[0];
            }
        }

        if(target == null) return;

        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
           creep.moveTo(target, {visualizePathStyle: {stroke: '#0000ff'}});
           if(creep.memory.target != null)
           {
                SourceEx.UnlinkTarget(creep, creep.memory.target);
                creep.memory.target = target.id;
           }
        }

    },
    PickupWaste:function(creep)
    {
        var energy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 10);
        if(energy.length && creep.pickup(energy[0]) == ERR_NOT_IN_RANGE)
        {
            console.log(energy[0]);
            creep.moveTo(energy[0]);
        }
    }
};
module.exports = creepDefault;