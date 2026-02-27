"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingModule = void 0;
const applicationModule_1 = require("../../shared/modules/applicationModule");
const contactListSpy_1 = require("./adapters/contactListAPI/contactListSpy");
const mailChimpContactList_1 = require("./adapters/contactListAPI/mailChimpContactList");
const marketingController_1 = require("./marketingController");
const marketingErrors_1 = require("./marketingErrors");
const marketingService_1 = require("./application/marketingService");
class MarketingModule extends applicationModule_1.ApplicationModule {
    constructor(config) {
        super(config);
        this.contactListAPI = this.buildContactListAPI();
        this.marketingService = this.createMarketingService();
        this.marketingController = this.createMarketingController();
    }
    static build(config) {
        return new MarketingModule(config);
    }
    createMarketingService() {
        return new marketingService_1.MarketingService(this.contactListAPI);
    }
    createMarketingController() {
        return new marketingController_1.MarketingController(this.marketingService, marketingErrors_1.marketingErrorHandler);
    }
    buildContactListAPI() {
        if (this.getEnvironment() === "production") {
            return new mailChimpContactList_1.MailchimpContactList();
        }
        return new contactListSpy_1.ContactListAPISpy();
    }
    getMarketingController() {
        return this.marketingController;
    }
    mountRouter(webServer) {
        webServer.mountRouter("/marketing", this.marketingController.getRouter());
    }
    getMarketingService() {
        return this.marketingService;
    }
    getContactListAPI() {
        return this.contactListAPI;
    }
}
exports.MarketingModule = MarketingModule;
