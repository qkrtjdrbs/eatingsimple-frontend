import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useParams } from "react-router-dom";

const SEARCH_RECIPES_QUERY = gql`
  query searchRecipes($keyword: String!) {
    searchRecipes(keyword: $keyword) {
      id
      title
      userId
      isMine
      likes
      createdAt
    }
  }
`;
export default function SearchedRecipes() {
  const { keyword } = useParams();
  const { data } = useQuery(SEARCH_RECIPES_QUERY, { variables: { keyword } });
  return (
    <div>
      {" "}
      {data?.searchRecipes?.map((recipe, index) => (
        <div key={index}>{recipe.title}</div>
      ))}
    </div>
  );
}
