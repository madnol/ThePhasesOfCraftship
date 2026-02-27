"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessService = void 0;
const child_process_1 = require("child_process");
class ProcessService {
    static killProcessOnPort(port, cb) {
        const killCommand = process.platform === "win32"
            ? `netstat -ano | findstr :${port} | findstr LISTENING`
            : `lsof -i:${port} -t`;
        (0, child_process_1.exec)(killCommand, (error, stdout, stderr) => {
            if (error) {
                // console.error(`Failed to execute the command: ${error.message}`);
                return cb ? cb() : "";
            }
            if (stderr) {
                // console.error(`Command execution returned an error: ${stderr}`);
                return cb ? cb() : "";
            }
            const processId = stdout.trim();
            if (processId) {
                const killProcessCommand = process.platform === "win32"
                    ? `taskkill /F /PID ${processId}`
                    : `kill ${processId}`;
                (0, child_process_1.exec)(killProcessCommand, (error, _stdout, _stderr) => {
                    if (error) {
                        // console.error(`Failed to kill the process: ${error.message}`);
                        return cb ? cb() : "";
                    }
                    // console.log(`Process running on port ${port} has been killed.`);
                    return cb ? cb() : "";
                });
            }
            else {
                // console.log(`No process found running on port ${port}.`);
                return cb ? cb() : "";
            }
        });
    }
}
exports.ProcessService = ProcessService;
