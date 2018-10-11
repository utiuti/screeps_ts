global.RES_COLORS = {
    H: '#989898',
    O: '#989898',
    U: '#48C5E5',
    L: '#24D490',
    K: '#9269EC',
    Z: '#D9B478',
    X: '#F26D6F',
    energy: '#FEE476',
    power: '#F1243A',

    OH: '#B4B4B4',
    ZK: '#B4B4B4',
    UL: '#B4B4B4',
    G: '#FFFFFF',

    UH: '#50D7F9',
    UO: '#50D7F9',
    KH: '#A071FF',
    KO: '#A071FF',
    LH: '#00F4A2',
    LO: '#00F4A2',
    ZH: '#FDD388',
    ZO: '#FDD388',
    GH: '#FFFFFF',
    GO: '#FFFFFF',

    UH2O: '#50D7F9',
    UHO2: '#50D7F9',
    KH2O: '#A071FF',
    KHO2: '#A071FF',
    LH2O: '#00F4A2',
    LHO2: '#00F4A2',
    ZH2O: '#FDD388',
    ZHO2: '#FDD388',
    GH2O: '#FFFFFF',
    GHO2: '#FFFFFF',

    XUH2O: '#50D7F9',
    XUHO2: '#50D7F9',
    XKH2O: '#A071FF',
    XKHO2: '#A071FF',
    XLH2O: '#00F4A2',
    XLHO2: '#00F4A2',
    XZH2O: '#FDD388',
    XZHO2: '#FDD388',
    XGH2O: '#FFFFFF',
    XGHO2: '#FFFFFF'

}

/**
Module: prototype.Room.structures v1.5
Author: SemperRabbit
Date:   20180309-13,0411
Usage:  require('prototype.Room.structures');

This module will provide structure caching and extends the Room
  class' prototype to provide `room.controller`-like properties
  for all structure types. It will cache the object IDs of a
  room.find() grouped by type as IDs in global. Once the property
  is requested, it will chech the cache (and refresh if required),
  then return the appropriate objects by maping the cache's IDs
  into game objects for that tick.

Changelog:
1.0: Initial publish
1.1: Changed multipleList empty results from `null` to `[]`
     Bugfix: changed singleList returns from arrays to single objects or undefined
1.2: Added intra-tick caching in addition to inter-tick caching
1.3: Multiple bugfixes
1.4: Moved STRUCTURE_POWER_BANK to `multipleList` due to proof of *possibility* of multiple
        in same room.
1.5: Added CPU Profiling information for Room.prototype._checkRoomCache() starting on line 47
1.6: Added tick check for per-tick caching, in preperation for the potential "persistent Game
        object" update. Edits on lines 73, 77-83, 95, 99-105
*/

var roomStructures = {};
var roomStructuresExpiration = {};

const CACHE_TIMEOUT = 50;
const CACHE_OFFSET = 4;

const multipleList = [
    STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL,
    STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL, STRUCTURE_LINK,
    STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_CONTAINER, STRUCTURE_POWER_BANK,
];

const singleList = [
    STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR, STRUCTURE_NUKER,
    //STRUCTURE_TERMINAL,   STRUCTURE_CONTROLLER,   STRUCTURE_STORAGE,
];

function getCacheExpiration() {
    return CACHE_TIMEOUT + Math.round((Math.random() * CACHE_OFFSET * 2) - CACHE_OFFSET);
}

/********* CPU Profiling stats for Room.prototype._checkRoomCache ********** 
calls         time      avg        function
550106        5581.762  0.01015    Room._checkRoomCache

calls with cache reset: 4085
avg for cache reset:    0.137165
calls without reset:    270968
avg without reset:      0.003262
****************************************************************************/
Room.prototype._checkRoomCache = function _checkRoomCache() {
    // if cache is expired or doesn't exist
    if (!roomStructuresExpiration[this.name] || !roomStructures[this.name] || roomStructuresExpiration[this.name] < Game.time) {
        roomStructuresExpiration[this.name] = Game.time + getCacheExpiration();
        roomStructures[this.name] = _.groupBy(this.find(FIND_STRUCTURES), s => s.structureType);
        var i;
        for (i in roomStructures[this.name]) {
            roomStructures[this.name][i] = _.map(roomStructures[this.name][i], s => s.id);
        }
    }
}

/* Object.defineProperty(Room.prototype, 'checkRoomCache', {
    get function() {
        // if cache is expired or doesn't exist
        if (!roomStructuresExpiration[this.name] || !roomStructures[this.name] || roomStructuresExpiration[this.name] < Game.time) {
            roomStructuresExpiration[this.name] = Game.time + getCacheExpiration();
            roomStructures[this.name] = _.groupBy(this.find(FIND_STRUCTURES), s => s.structureType);
            var i;
            for (i in roomStructures[this.name]) {
                roomStructures[this.name][i] = _.map(roomStructures[this.name][i], s => s.id);
            }
        }
    }
}
), */

multipleList.forEach(function (type) {
    Object.defineProperty(Room.prototype, type + 's', {
        get: function () {
            if (this['_' + type + 's'] && this['_' + type + 's_ts'] === Game.time) {
                return this['_' + type + 's'];
            } else {
                this._checkRoomCache();
                if (roomStructures[this.name][type]) {
                    this['_' + type + 's_ts'] = Game.time;
                    return this['_' + type + 's'] = roomStructures[this.name][type].map(Game.getObjectById);
                } else {
                    this['_' + type + 's_ts'] = Game.time;
                    return this['_' + type + 's'] = [];
                }
            }
        },
        set: function () { },
        enumerable: false,
        configurable: true,
    });
});

singleList.forEach(function (type) {
    Object.defineProperty(Room.prototype, type, {
        get: function () {
            if (this['_' + type] && this['_' + type + '_ts'] === Game.time) {
                return this['_' + type];
            } else {
                this._checkRoomCache();
                if (roomStructures[this.name][type]) {
                    this['_' + type + '_ts'] = Game.time;
                    return this['_' + type] = Game.getObjectById(roomStructures[this.name][type][0]);
                } else {
                    this['_' + type + '_ts'] = Game.time;
                    return this['_' + type] = undefined;
                }
            }
        },
        set: function () { },
        enumerable: false,
        configurable: true,
    });
});