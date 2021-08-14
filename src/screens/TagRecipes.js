import { useParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";

export default function TagRecipes() {
  const { tag } = useParams();
  const hashTag = "#" + tag;
  return (
    <div>
      <PageTitle title={"태그"} />
      {hashTag}
    </div>
  );
}
