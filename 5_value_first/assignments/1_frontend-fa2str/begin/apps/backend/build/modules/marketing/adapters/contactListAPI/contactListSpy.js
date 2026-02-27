"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactListAPISpy = void 0;
const spy_1 = require("../../../../shared/testDoubles/spy");
class ContactListAPISpy extends spy_1.Spy {
    constructor() {
        super();
    }
    addEmailToList(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`ContactListAPISpy: Adding ${email} to list... this is for testing & development purposes.`);
            this.addCall("addEmailToList", [email]);
            return true;
        });
    }
}
exports.ContactListAPISpy = ContactListAPISpy;
