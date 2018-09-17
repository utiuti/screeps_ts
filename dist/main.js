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
    }
    Scheduler.getInstance = function () {
        return this._instance;
    };
    Scheduler.prototype.spawnProcess = function (p) {
        this._processes.push(p);
    };
    Scheduler.prototype.run = function () {
        var isRunningFor = 0;
        var limit = Game.cpu.limit;
        this._processes.forEach(function (x) {
            if (x.sleep > 0) {
                x.sleep -= 1;
                numberSleeps += 1;
            }
            else if (isRunningFor < limit) {
                numberProcessesRun += 1;
                console.log("X: " + x);
                isRunningFor += x.run();
            }
        });
    };
    Scheduler.prototype.sortByLastRun = function () {
        this._processes.sort(function (a, b) {
            return a.lastRun - b.lastRun;
        });
    };
    Scheduler.prototype.sortByPriority = function () {
        this._processes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    };
    Scheduler.prototype.initialize = function () {
        if (!Memory.processes) {
            console.log("Initialise Process Memory");
            Memory.processes = {};
            for (var j = 1; j < 21; j++) {
                console.log("Initialise Processes");
                this.spawnProcess(new Process(j, getRandomIntInclusive(0, 3)));
                this.writeToMemory();
            }
        }
    };
    Scheduler.prototype.setSleepTime = function () {
        this.getRandomProcess().sleep = getRandomIntInclusive(0, 3);
    };
    Scheduler.prototype.getRandomProcess = function () {
        return this._processes[Math.floor(Math.random() * this._processes.length)];
    };
    Scheduler.prototype.readFromMemory = function () {
        this._processes = Memory.processes;
    };
    Scheduler.prototype.writeToMemory = function () {
        Memory.processes = this._processes;
    };
    Scheduler.prototype.toString = function () {
        this._processes.forEach(function (x) {
            console.log("PID: " + ("     " + x.pid).slice(-5) + " Priority: " + x.priority + " Task: " + x.task + " lastRun: " + x.lastRun + " sleepTime: " + x.sleep);
        });
    };
    Scheduler._instance = new Scheduler();
    return Scheduler;
}());
var Process = /** @class */ (function () {
    function Process(thePid, priority, theTask) {
        if (priority === void 0) { priority = Priority.Middle; }
        if (theTask === void 0) { theTask = "Task" + getRandomIntInclusive(100, 999); }
        this.thePid = thePid;
        this.priority = priority;
        this.theTask = theTask;
        this.pid = thePid;
        this.task = theTask;
        this.lastRun = 0;
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
// ca 20 Prozesse initialisieren
p.initialize();
p.readFromMemory();
// p.run();
p.sortByLastRun();
// p.setSleepTime();
p.writeToMemory();
p.toString();
console.log("Counter: " + numberProcessesRun + " NumberSleeps: " + numberSleeps);
//# sourceMappingURL=main.js.map