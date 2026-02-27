import { Posts } from "@dddforum/api";

interface PostDmProps {
  id: string;
  title: string;
  content?: string;
  link?: string;
  memberId: string;
  memberUsername: string;
  dateCreated: string;
  voteScore?: number;
  numComments: number;
  slug: string;
}

export class PostDm {

  constructor(public props: PostDmProps) {

  }

  static fromDTO(dto: Posts.DTOs.PostDTO): PostDm {
    return new PostDm({
      id: dto.id,
      title: dto.title,
      content: dto.content,
      link: dto.link,
      memberId: dto.member.memberId,
      memberUsername: dto.member.username,
      dateCreated: dto.dateCreated,
      voteScore: dto.voteScore,
      numComments: dto.numComments,
      slug: dto.slug
    });
  }
}
