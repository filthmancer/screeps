var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCourier = require('role.courier');

var def = require("creep.default");

var energy_threshold = 50;
var spawns = ["Spawn1"];
var creeps_desired = {
    "harvester":{role:"harvester", body:[WORK, MOVE, CARRY], num:0},
    "courier": {role:"courier", body:[CARRY, CARRY, MOVE, MOVE], num:1},
    "miner" : {role:"miner", body:[WORK,WORK, CARRY, MOVE], num:4},
    "courier": {role:"courier", body:[CARRY, CARRY, MOVE, MOVE], num:1},
    "builder": {role:"builder", body:[WORK,WORK, CARRY,MOVE], num:3},
    "upgrader": {role:"upgrader", body:[WORK,CARRY, CARRY, MOVE], num:3},
    
    
};


const creeps_current = {};

var creepManager =
{
    update:function()
    {
       
        if(Game.cpu.bucket > 100)
        {
            for(var i in Memory.creeps) {

                if(!Game.creeps[i]) {
                    console.log("MEM Deleting " + Memory.creeps[i]);
                    delete Memory.creeps[i];
                }
            }

            for(var s in Memory.sources)
            {
                if(Memory.sources[s] == null) Memory.sources[s] = [];
                if(Memory.sources[s].length > 3)
                {
                    for(var c in Memory.sources[s])
                    {
                        var creep = Game.getObjectById(Memory.sources[s][c]);
                        if(creep == null) 
                        {
                            Memory.sources[s].shift();
                            break;
                        }
                        SourceEx.UnlinkCreepAndSource(creep, s);
                        Memory.sources[s].shift();
                    }
                    continue;
                }
                for(var c in Memory.sources[s])
                {
                    if(Game.getObjectById(Memory.sources[s][c]) == null) Memory.sources[s][c] = null;
                }
            }

            for(var c in Game.creeps){
                var creep = Game.creeps[c];
               
                if(creeps_desired[creep.memory.role] == null)
                {
                    console.log("desired " + creep.memory.role + " field does not exist!");
                    return;
                }
                var num = _(Memory.creeps).filter({role:creep.memory.role}).size();
                if(num > creeps_desired[creep.memory.role].num)
                {
                    console.log("TOO MANY " + creep.memory.role + ", deleting " + creep.name);
                    creep.suicide();
                }
            }
        }

        
        
        //console.log("BEFORE SPAWNER: " + Game.cpu.tickLimit);
        this.spawncreeps();
        //console.log("BEFORE UPDATE:" + Game.cpu.tickLimit);
        this.updatecreeps();
        //console.log("AFTER UPDATE: " + Game.cpu.tickLimit);
    },
    
    spawncreeps: function()
    {
        for(var i  =0; i < spawns.length; i++)
        {
            var spawn = Game.spawns[spawns[i]];
            if(spawn == null) continue;
            
            var e = spawn.energy;
            if(e > energy_threshold)
            {
                
                for(var c in creeps_desired)
                {
                    var role = creeps_desired[c].role;
                    var num = _(Memory.creeps).filter({role:role}).size();
                    if(num < creeps_desired[c].num)
                    {
                       var c = spawn.createCreep(creeps_desired[c].body, null, {role:role})
                       if(c == 0)
                       {
                        console.log("created creep: " + role);
                       }
                       break;
                   }
                   
               }
           }
       }
   },

   updatecreeps: function()
   {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role){
            case "harvester":
            roleHarvester.run(creep);
            break;
            case "upgrader":
            roleUpgrader.run(creep);
            break;
            case "builder":
            roleBuilder.run(creep);
            break;
            case "miner":
            if(creep.carry.energy < creep.carryCapacity) {
                def.Mine(creep);
            }
            break;
            case "courier":
             if(creep.carry.energy < creep.carryCapacity) {
                def.GrabResources(creep);
            }
            else if(!def.TakeEnergyToTarget(creep, Game.spawns["Spawn1"]))
            {
                def.PickupWaste(creep);
            }
            break;
        }
    }
},


}


module.exports = creepManager;