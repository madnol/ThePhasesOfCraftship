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
exports.ProductionMembersRepository = void 0;
const member_1 = require("../../domain/member");
class ProductionMembersRepository {
    constructor(prisma, eventsTable) {
        this.prisma = prisma;
        this.eventsTable = eventsTable;
    }
    getMemberByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberData = yield this.prisma.member.findUnique({
                where: { userId: userId },
            });
            if (!memberData) {
                return null;
            }
            return member_1.Member.toDomain(memberData);
        });
    }
    saveAggregateAndEvents(member, events) {
        return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            yield this.save(member, tx);
            yield this.eventsTable.save(events, tx);
        }));
    }
    findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberData = yield this.prisma.member.findUnique({
                where: { username: username },
            });
            if (!memberData) {
                return null;
            }
            return member_1.Member.toDomain(memberData);
        });
    }
    getMemberById(memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberData = yield this.prisma.member.findUnique({
                where: { id: memberId },
            });
            if (!memberData) {
                return null;
            }
            return member_1.Member.toDomain(memberData);
        });
    }
    save(member, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaInstance = transaction || this.prisma;
            const memberData = member.toPersistence();
            try {
                yield prismaInstance.member.upsert({
                    where: { id: memberData.id },
                    update: memberData,
                    create: memberData,
                });
            }
            catch (err) {
                console.log(err);
                throw new Error("Database exception");
            }
        });
    }
}
exports.ProductionMembersRepository = ProductionMembersRepository;
