import { useParams } from "react-router-dom";

export default function SortingRecipes() {
  const { sorting } = useParams();
  return <div>{sorting === "recent" ? "최신순" : "추천순"}</div>;
}
