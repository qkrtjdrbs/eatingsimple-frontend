import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Bulletin from "../components/Bulletin";
import Loader from "react-loader-spinner";

const Wrapper = styled.div`
  padding: 40px 200px;
  height: auto;
  width: 100%;
`;

const LoadingBox = styled.div`
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
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
      isLiked
      createdAt
    }
  }
`;

export default function SortingRecipes() {
  const { sorting } = useParams();
  const { data, loading } = useQuery(SEE_RECENT_RECIPES);
  return (
    <Wrapper>
      {loading ? (
        <LoadingBox>
          <Loader type="ThreeDots" color="#0095f6" height={50} width={50} />
        </LoadingBox>
      ) : sorting === "recent" ? (
        data?.seeRecentRecipes?.map((recipe) => (
          <Bulletin key={recipe.id} sorting={sorting} {...recipe} />
        ))
      ) : (
        "추천순"
      )}
    </Wrapper>
  );
}
