"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberUsername = void 0;
const src_1 = require("@dddforum/errors/src");
const src_2 = require("@dddforum/core/src");
const zod_1 = require("zod");
const memberUsernameSchema = zod_1.z.string().min(5).max(20);
class MemberUsername extends src_2.ValueObject {
    constructor(props) {
        super(props);
    }
    get value() {
        return this.props.value;
    }
    static toDomain(value) {
        return new MemberUsername({ value });
    }
    static create(input) {
        /**
         * Handle validation rules here. There are many possibilities for types of validation rules
         * we could use here.
         */
        const result = memberUsernameSchema.safeParse(input);
        if (result.success) {
            return new MemberUsername({ value: input });
        }
        return new src_1.ApplicationErrors.ValidationError(`Member username invalid`);
    }
}
exports.MemberUsername = MemberUsername;
