import { NumberUtil, TextUtil, ValueObject } from "@dddforum/core";

type PostSlugProps = {
  value: string;
}

export class PostSlug extends ValueObject<PostSlugProps> {

  constructor (props: PostSlugProps) {
    super(props)
  }

  get value () {
    return this.props.value;
  }

  public static create (title: string) {
    let hash = NumberUtil.generateRandomInteger(10000, 999999);
    let kebabCase = TextUtil.kebabCase(title);
    let value = `${kebabCase}-${hash}`;
    return new PostSlug({value})
  }

  public static toDomain (value: string): PostSlug {
    return new PostSlug({value});
  }
}