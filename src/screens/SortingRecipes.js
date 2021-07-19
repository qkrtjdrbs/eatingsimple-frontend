import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Bulletin from "../components/Bulletin";

const Wrapper = styled.div`
  padding: 40px 200px;
  height: auto;
  width: 100%;
`;

const SEE_RECENT_RECIPES = gql`
  query seeRecentRecipes {
    seeRecentRecipes {
      id
      title
      user {
        username
        avatar
      }
      commentsCount
      likes
      isMine
    }
  }
`;

export default function SortingRecipes() {
  const { sorting } = useParams();
  const { data } = useQuery(SEE_RECENT_RECIPES);
  return (
    <Wrapper>
      {sorting === "recent"
        ? data?.seeRecentRecipes?.map((recipe) => (
            <Bulletin key={recipe.id} sorting={sorting} {...recipe} />
          ))
        : "추천순"}
    </Wrapper>
  );
}
