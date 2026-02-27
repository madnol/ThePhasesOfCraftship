"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spy = void 0;
class Spy {
    constructor() {
        this.calls = [];
    }
    addCall(methodName, args, context) {
        const call = {
            methodName,
            args,
            context,
        };
        this.calls.push(call);
    }
    getCalls() {
        return this.calls;
    }
    getTimesMethodCalled(methodName) {
        const calls = this.calls.filter((call) => call.methodName === methodName);
        return calls.length;
    }
    reset() {
        this.calls = [];
    }
}
exports.Spy = Spy;
