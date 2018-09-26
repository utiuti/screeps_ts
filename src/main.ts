declare var global: any;
declare var _self: any;

enum Priority {
    VeryHigh = 4,
    High = 3,
    Middle = 2,
    Low = 1,
    VeryLow = 0
}

var numberProcessesRun = 0;
var numberSleeps = 0;
class Scheduler {

    private static _instance: Scheduler = new Scheduler();

    private _self;

    public static getInstance(): Scheduler {
        return this._instance;
    }

    private _processes: Array<Process> = [];

    private constructor() {
        _self = this;
    }

    public run() {
        let isRunningFor = 0;
        let limit = Game.cpu.limit;
        if (_self._processes.length == 0) { this.initialize(); }
        _self._processes.forEach(x => {

            if (x.sleep > 0) {
                x.sleep -= 1;
                numberSleeps += 1;
            }

            else if (isRunningFor < limit) {

                numberProcessesRun += 1;
                isRunningFor += x.run();

            }
        });
    }

    public initialize() {
        if (Memory.processes) {
            console.log('<font color="' + "ffcc00" + '" type="highlight">' + "Get Processes from Memory" + "</font>");
            Memory.processes.forEach(function (x) {
                _self.spawnProcess(new Process(x.thePid, x.priority, x.theTask, x.theLastRun));
            });
        }
        else {
            console.log('<font color="' + "ffcc00" + '" type="highlight">' + "Initialise Processes + Memory" + "</font>");
            Memory.processes = [];
            for (var j = 1; j < 7; j++) {
                _self.spawnProcess(new Process(j, getRandomIntInclusive(0, 3)));
            }
        }
    }

    public spawnProcess(p: Process) {
        _self._processes.push(p)
    }

    public sortByLastRun() {
        _self._processes.sort(function (a, b) {
            return a.lastRun - b.lastRun;
        });
    }

    public sortByPriority() {
        _self._processes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    }

    public setSleepTime() {
        _self.getRandomProcess().sleep = getRandomIntInclusive(0, 3);
    }

    public getRandomProcess() {
        return _self._processes[Math.floor(Math.random() * this._processes.length)]
    }

    public readFromMemory() {
        // console.log("Read Memory. Memory.process exists?: " + Memory.processes);
        // this.initialize(); //TODO This does not work
        // this._processes = Memory.processes;
    }

    public writeToMemory() {
        Memory.processes = _self._processes;
    }

    public toString() {
        _self._processes.forEach(x => {
            console.log(`PID: ${("     " + x.pid).slice(-5)} Priority: ${x.priority} Task: ${x.task} lastRun: ${x.lastRun} sleepTime: ${x.sleep}`);
        })
    }

}

class Process {
    pid: number;
    task: string;
    lastRun: number;
    sleep: number;

    constructor(
        public thePid: number,
        public priority: Priority = Priority.Middle,
        public theTask: string = "Task" + getRandomIntInclusive(100, 999),
        public theLastRun: number = 0
    ) {
        this.pid = thePid;
        this.task = theTask;
        this.lastRun = theLastRun;
        this.sleep = 0;
    }
    run() {
        let runtime = getRandomIntInclusive(1, 4);
        this.lastRun = Game.time || 0;
        return runtime;
    }
    toString() {
        // abgefahrene Formatierung mit slice :-) powered by Henner
        return `PID: ${("     " + this.pid).slice(-5)} Priority: ${this.priority} Task: ${this.task} lastRun: ${this.lastRun}`;
    }
}

function PidExists(pid: number, pArray: Array<Process>) {
    return pArray.filter(p => p.pid == pid).length > 0;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Programm Start
let p = Scheduler.getInstance();

//p.readFromMemory();
p.run();
p.sortByLastRun();
//p.setSleepTime();
p.writeToMemory();

console.log("---------------------------");
p.toString();
console.log(`Counter: ${numberProcessesRun} NumberSleeps: ${numberSleeps}`);
