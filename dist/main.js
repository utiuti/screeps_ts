var Priority;
(function (Priority) {
    Priority[Priority["VeryHigh"] = 4] = "VeryHigh";
    Priority[Priority["High"] = 3] = "High";
    Priority[Priority["Middle"] = 2] = "Middle";
    Priority[Priority["Low"] = 1] = "Low";
    Priority[Priority["VeryLow"] = 0] = "VeryLow";
})(Priority || (Priority = {}));
var numberProcessesRun = 0;
var numberSleeps = 0;
var Scheduler = /** @class */ (function () {
    function Scheduler() {
        this._processes = [];
        _self = this;
    }
    Scheduler.getInstance = function () {
        return this._instance;
    };
    Scheduler.prototype.run = function () {
        var isRunningFor = 0;
        var limit = Game.cpu.limit;
        if (_self._processes.length == 0) {
            this.initialize();
        }
        _self._processes.forEach(function (x) {
            if (x.sleep > 0) {
                x.sleep -= 1;
                numberSleeps += 1;
            }
            else if (isRunningFor < limit) {
                numberProcessesRun += 1;
                isRunningFor += x.run();
            }
        });
    };
    Scheduler.prototype.initialize = function () {
        if (Memory.processes) {
            console.log('<font color="' + "ffcc00" + '" type="highlight">' + "Get Processes from Memory" + "</font>");
            Memory.processes.forEach(function (x) {
                _self.spawnProcess(new Process(x.thePid, x.priority, x.theTask, x.lastRun));
            });
        }
        else {
            console.log('<font color="' + "ffcc00" + '" type="highlight">' + "Initialise Processes + Memory" + "</font>");
            Memory.processes = [];
            for (var j = 1; j < 7; j++) {
                _self.spawnProcess(new Process(j, getRandomIntInclusive(0, 3)));
            }
        }
    };
    Scheduler.prototype.spawnProcess = function (p) {
        _self._processes.push(p);
    };
    Scheduler.prototype.sortByLastRun = function () {
        _self._processes.sort(function (a, b) {
            return a.lastRun - b.lastRun;
        });
    };
    Scheduler.prototype.sortByPriority = function () {
        _self._processes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    };
    Scheduler.prototype.setSleepTime = function () {
        _self.getRandomProcess().sleep = getRandomIntInclusive(0, 3);
    };
    Scheduler.prototype.getRandomProcess = function () {
        return _self._processes[Math.floor(Math.random() * this._processes.length)];
    };
    Scheduler.prototype.readFromMemory = function () {
        // console.log("Read Memory. Memory.process exists?: " + Memory.processes);
        // this.initialize(); //TODO This does not work
        // this._processes = Memory.processes;
    };
    Scheduler.prototype.writeToMemory = function () {
        Memory.processes = _self._processes;
    };
    Scheduler.prototype.toString = function () {
        _self._processes.forEach(function (x) {
            console.log("PID: " + ("     " + x.pid).slice(-5) + " Priority: " + x.priority + " Task: " + x.task + " lastRun: " + x.lastRun + " sleepTime: " + x.sleep);
        });
    };
    Scheduler._instance = new Scheduler();
    return Scheduler;
}());
var Process = /** @class */ (function () {
    function Process(thePid, priority, theTask, theLastRun) {
        if (priority === void 0) { priority = Priority.Middle; }
        if (theTask === void 0) { theTask = "Task" + getRandomIntInclusive(100, 999); }
        if (theLastRun === void 0) { theLastRun = 0; }
        this.thePid = thePid;
        this.priority = priority;
        this.theTask = theTask;
        this.theLastRun = theLastRun;
        this.pid = thePid;
        this.task = theTask;
        this.lastRun = theLastRun;
        this.sleep = 0;
    }
    Process.prototype.run = function () {
        var runtime = getRandomIntInclusive(1, 4);
        this.lastRun = Game.time || 0;
        return runtime;
    };
    Process.prototype.toString = function () {
        // abgefahrene Formatierung mit slice :-) powered by Henner
        return "PID: " + ("     " + this.pid).slice(-5) + " Priority: " + this.priority + " Task: " + this.task + " lastRun: " + this.lastRun;
    };
    return Process;
}());
function PidExists(pid, pArray) {
    return pArray.filter(function (p) { return p.pid == pid; }).length > 0;
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Programm Start
var p = Scheduler.getInstance();
//p.readFromMemory();
p.run();
p.sortByLastRun();
//p.setSleepTime();
p.writeToMemory();
console.log("---------------------------");
p.toString();
console.log("Counter: " + numberProcessesRun + " NumberSleeps: " + numberSleeps);
//# sourceMappingURL=main.js.map