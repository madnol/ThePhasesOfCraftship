import { Database, Prisma } from "@dddforum/database";
import { CommentRepository } from "../ports/commentRepository";
import { Comment } from "../../domain/comment";
import { EventOutboxTable } from "@dddforum/outbox";
import { DomainEvent } from "@dddforum/core";

export class ProductionCommentsRepository implements CommentRepository {
  constructor(
    private database: Database,
    private eventsTable: EventOutboxTable

  ) {}

  async save(comment: Comment, transaction?: Prisma.TransactionClient) {
    const prismaInstance = transaction || this.database.getConnection();

    const commentData = comment.toPersistence();

    try {
      await prismaInstance.comment.upsert({
        where: { id: commentData.id },
        update: commentData,
        create: commentData,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Database exception");
    }
  }

  async getCommentById(id: string): Promise<Comment | null> {
    const connection = this.database.getConnection();

    const comment = await connection.comment.findUnique({
      where: { id },
    });

    if (!comment) return null;

    return Comment.toDomain(comment);
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return [];
  }

  async saveAggregateAndEvents(comment: Comment, events: DomainEvent[]) {
    const connection = this.database.getConnection();

    return connection.$transaction(async (tx) => {
      await this.save(comment, tx);
      await this.eventsTable.save(events, tx);
    })
  }
}
