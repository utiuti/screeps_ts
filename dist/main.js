var Process = /** @class */ (function () {
    function Process(thePid, thePriority, theTask) {
        this.pid = thePid;
        this.priority = thePriority;
        this.task = theTask;
    }
    Process.prototype.show = function () {
        console.log("PID: " + this.pid + " Priority: " + this.priority + " Task: " + this.task);
    };
    Process.prototype.run = function () {
        var runtime = Math.round(Math.random() * 100);
        console.log("Runtime: " + runtime);
    };
    Process.prototype.toString = function () {
        return this.pid + ": " + this.task;
    };
    return Process;
}());
var testarray = [];
for (var i = 0; i < 20; i++) {
    var obj = new Process(Math.round(Math.random() * 100), Math.round(Math.random() * 100), "Testtask" + i);
    testarray.push(obj);
}
testarray.forEach(function (x) {
    x.show();
    console.log(x.toString());
});
//# sourceMappingURL=main.js.map