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

    public static getInstance(): Scheduler {
        return this._instance;
    }

    private _processes: Array<Process> = [];

    private constructor() {
    }

    public spawnProcess(p: Process) {
        this._processes.push(p)
    }

    public run() {
        let isRunningFor = 0;
        let limit = 300;

        this._processes.forEach(x => {

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

    public sortByLastRun() {
        this._processes.sort(function (a, b) {
            return a.lastRun - b.lastRun;
        });
    }

    public sortByPriority() {
        this._processes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    }
    public initialize() {
        for (var j = 1; j < 21; j++) {
            this.spawnProcess(new Process(j, getRandomIntInclusive(0, 3)));
        }
    }
    public setSleepTime() {
        this.getRandomProcess().sleep = getRandomIntInclusive(0, 3);
    }

    public getRandomProcess() {
        return this._processes[Math.floor(Math.random() * this._processes.length)]
    }

    public toString() {
        this._processes.forEach(x => {
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
        public theTask: string = "Task" + getRandomIntInclusive(100, 999)
    ) {
        this.pid = thePid;
        this.task = theTask;
        this.lastRun = 0;
        this.sleep = 0;
    }
    run() {
        let runtime = getRandomIntInclusive(1, 100);
        this.lastRun = i || 0;
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

// ca. 20 Prozesse initialisieren
p.initialize();

// Simuliert 100 Programmdurchläufe
for (var i = 0; i < 100; i++) {
    p.run();
    p.sortByLastRun();
    p.setSleepTime();
}
p.toString();
console.log(`Counter: ${numberProcessesRun} NumberSleeps: ${numberSleeps}`);
