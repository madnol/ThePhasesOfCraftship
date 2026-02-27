"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMissingKeys = isMissingKeys;
exports.isBetweenLength = isBetweenLength;
function isMissingKeys(data, keysToCheckFor) {
    for (const key of keysToCheckFor) {
        if (data[key] === undefined)
            return true;
    }
    return false;
}
function isBetweenLength(str, min, max) {
    return str.length >= min && str.length <= max;
}
