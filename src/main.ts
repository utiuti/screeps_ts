class Process {
    pid: number;
    priority: number;
    task: string;
    constructor(
        thePid: number,
        thePriority: number,
        theTask: string
    ) {
        this.pid = thePid;
        this.priority = thePriority;
        this.task = theTask;
    }
    show() {
        console.log("PID: " + this.pid + " Priority: " + this.priority + " Task: " + this.task);
    }
    run() {
        let runtime = Math.round(Math.random() * 100);
        console.log("Runtime: " + runtime);
    }
    toString() {
        return `${this.pid}: ${this.task}`;
    }

}
var testarray = []

for (var i = 0; i < 20; i++) {
    let obj = new Process(Math.round(Math.random() * 100), Math.round(Math.random() * 100), "Testtask" + i);
    testarray.push(obj);
}
testarray.forEach(x => {
    x.show();
});