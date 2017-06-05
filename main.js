var creepMan = require("creep.manager");
var towerMan = require("tower.default");

module.exports.loop = function () {
    creepMan.update();
    towerMan.run();
    if(Memory.sources == null || Memory.sources.length == 0)
    {
        Memory.sources = {};
        var sources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);
        for(var s in sources)
        {
            Memory.sources[sources[s].id] = [];
        }
    }
}


global.SourceEx = 
{
    UnlinkCreepAndSource:function(creep, sourceid)
    {

        var source = Game.getObjectById(sourceid);
        if(creep.memory) creep.memory.source = null;

        for(var c in Memory.sources[sourceid])
        {
            console.log(c + ":" + creep.memory.source == c);
        }
        console.log("DELETING FROM " + Memory.sources[sourceid]);
    },
    LinkCreepAndSource:function(creep, sourceid)
    {  
        var source = Game.getObjectById(sourceid);
        creep.memory.source = sourceid;
        for(var c in Memory.sources[sourceid])
        {
            if(Memory.sources[sourceid][c] == creep.id) return;
        }
        Memory.sources[sourceid].push(creep.id);
    },

    getEmptySource: function(creep)
    {
        var sources = creep.room.find(FIND_SOURCES);
        if(Memory.sources == null) Memory.sources = {};
        
        var output = null;
         for(var s in sources)
         {
             var source = sources[s];
             if(source.energy == 0) continue;
              
             if(Memory.sources[source.id] == null) Memory.sources[source.id] = [];

             if(Memory.sources[source.id].length < 3) output = source;
             else 
             {
                for(var c in Memory.sources[source.id])
                {
                    if(Memory.sources[source.id][c] == null) 
                        {
                            output = source;
                            break;
                        }
                    if(Memory.sources[source.id][c] == creep.id) 
                     {
                         output = source;
                         break;
                     }
                }  
                 
             }
            
             
         }
         if(output != null) SourceEx.LinkCreepAndSource(creep, output.id);
         return output;
    },

    UnlinkAllCreeps:function ()
    {
        for(var v in Game.creeps)
        {
            SourceEx.UnlinkCreepAndSource(Game.creeps[v], Game.creeps[v].memory.source);
            for(var m in Memory.sources)
            {
                delete Memory.sources[m];
              
            }
        }

    },

    UnlinkTarget:function(creep, targ)
    {
        creep.memory.target = null;
        for(var s in Memory.sources)
        {
            if(s == targ)
            {
                for(var c in Memory.sources[s])
                {
                    if(c == creep.id) Memory.sources[s][c] = null;
                }
            }
        }
    }
}


global.tools = 
{

    log :function(obj, indent = "")
    {
        var result = "";
        for(var property in obj)
        {
            var value = obj[property];
            if(typeof value == "string")
                value = "'" + value + "'";
            else if(typeof value == 'object')
            {
                if(value instanceof Array)
                {
                    value = "[" + value + "]";
                }
                else
                {
                    var od = tools.log(value, indent + "  ");
                    value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
                }
            }
            result += indent + "'" + property + "' : " + value + ",\n";
        }

        console.log(result.replace(/,\n$/,""));
    },


    killall: function()
    {
        for(var c in Game.creeps)
        {
            Game.creeps[c].suicide();
        }
        for(var m in Memory.creeps)
        {
            delete Memory.creeps[m];
        }
    },

    killrole : function(role)
    {
        for(var v in Game.creeps)
        {
            if(Game.creeps[v].memory.role == role) Game.creeps[v].suicide();
        }
    },
    clearTargetMemory :function()
    {
        console.log("CLEARING MEMORY");
        for(var c in Game.creeps)
        {
            var creep = Game.creeps[c];
            creep.memory.source = null;
        }
        Memory.sources = [];
    }
}


