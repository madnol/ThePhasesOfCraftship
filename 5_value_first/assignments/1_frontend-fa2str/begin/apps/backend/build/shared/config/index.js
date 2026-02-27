"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    constructor(script) {
        this.env = process.env.NODE_ENV || "development";
        this.script = script;
        this.apiURL = this.getAPIURL();
    }
    getEnvironment() {
        return this.env;
    }
    getScript() {
        return this.script;
    }
    getAPIURL() {
        return "http://localhost:3000";
    }
    get auth0() {
        // Todo: build the env check abstraction
        return {
            domain: process.env.AUTH0_DOMAIN,
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE,
        };
    }
}
exports.Config = Config;
