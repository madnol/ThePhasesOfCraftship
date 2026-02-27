import { Member } from "../../../src/modules/members/domain/member";
import { MembersModule } from "../../../src/modules/members/membersModule";
import { CompositionRoot } from "../../../src/shared/compositionRoot";

export class DatabaseFixture {
  constructor(private composition: CompositionRoot) {
  }

  getMemberById (id: string) {
    const membersModule = (this.composition.getModule('members') as MembersModule);
    const membersRepo = membersModule.getMembersRepository();
    return membersRepo.getMemberById(id);
  }

  async resetDatabase() {
    const connection = this.composition.getDatabase().getConnection();

    try {
      await connection.$transaction([
        connection.postVote.deleteMany(),
        connection.commentVote.deleteMany(),
        connection.comment.deleteMany(),
        connection.post.deleteMany(),
        connection.member.deleteMany()
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      await connection.$disconnect();
    }
  }

  async setupWithExistingMembers (members: Member[]) {
    const membersModule = (this.composition.getModule('members') as MembersModule);
    const membersRepo = membersModule.getMembersRepository();
    await Promise.all(members.map((member) => membersRepo.save(member)));
  }
}
