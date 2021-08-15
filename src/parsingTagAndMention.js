export default function parsingTagAndMention(sort, string) {
  if (sort === "tag") return string.match(/#[a-zA-Z0-9ㄱ-ㅎ가-힣]+/g);
  if (sort === "mention") return string.match(/@[a-zA-Z0-9ㄱ-ㅎ가-힣]+/g);
}
