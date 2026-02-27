"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModule = void 0;
class ApplicationModule {
    constructor(config) {
        this.config = config;
    }
    getEnvironment() {
        return this.config.getEnvironment();
    }
    getScript() {
        return this.config.getScript();
    }
    get shouldBuildFakeRepository() {
        return (this.getScript() === "test:unit" ||
            this.getEnvironment() === "development");
    }
}
exports.ApplicationModule = ApplicationModule;
