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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailjetTransactionalEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailSettings = {
    service: process.env.MAIL_SENDER_SERVICE || "gmail",
    user: process.env.MAIL_SENDER_EMAIL_ADDRESS,
    pass: process.env.MAIL_SENDER_PASSWORD,
};
// Create a transporter object using SMTP
const transporter = nodemailer_1.default.createTransport({
    service: mailSettings.service,
    auth: {
        user: mailSettings.user,
        pass: mailSettings.pass,
    },
    authMethod: "PLAIN",
});
class MailjetTransactionalEmail {
    sendMail(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Email content
            const mailOptions = Object.assign({ from: mailSettings.user }, input);
            try {
                new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error)
                            return reject(error);
                        return resolve(info);
                    });
                });
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
}
exports.MailjetTransactionalEmail = MailjetTransactionalEmail;
