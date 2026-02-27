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
exports.CreatePost = void 0;
const src_1 = require("@dddforum/errors/src");
const canCreatePost_1 = require("./canCreatePost");
const src_2 = require("@dddforum/core/src");
const post_1 = require("../../../domain/post");
const postVote_1 = require("../../../domain/postVote");
class CreatePost {
    constructor(postRepository, memberRepository) {
        this.postRepository = postRepository;
        this.memberRepository = memberRepository;
    }
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { memberId, title, content, postType, link } = request.props;
            const member = yield this.memberRepository.getMemberById(memberId);
            if (member === null) {
                return (0, src_2.fail)(new src_1.ApplicationErrors.NotFoundError('member'));
            }
            if (!canCreatePost_1.CanCreatePostPolicy.isAllowed(member)) {
                return (0, src_2.fail)(new src_1.ApplicationErrors.PermissionError());
            }
            const postOrError = post_1.Post.create({
                title: title,
                content: content,
                memberId: memberId,
                postType,
                link
            });
            if (postOrError instanceof src_1.ApplicationErrors.ValidationError) {
                return (0, src_2.fail)(postOrError);
            }
            const initialMemberVoteOrError = postVote_1.PostVote.create(memberId, postOrError.id);
            if (initialMemberVoteOrError instanceof src_1.ApplicationErrors.ValidationError) {
                return (0, src_2.fail)(initialMemberVoteOrError);
            }
            initialMemberVoteOrError.castVote('upvote');
            try {
                yield this.postRepository.saveAggregateAndEvents(postOrError, postOrError.getDomainEvents());
                return (0, src_2.success)(postOrError);
            }
            catch (error) {
                console.log(error);
                return (0, src_2.fail)(new src_1.ServerErrors.ServerErrorException());
            }
        });
    }
}
exports.CreatePost = CreatePost;
