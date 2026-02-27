"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPassword = generateRandomPassword;
function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    const passwordArray = [];
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        passwordArray.push(charset[randomIndex]);
    }
    return passwordArray.join("");
}
