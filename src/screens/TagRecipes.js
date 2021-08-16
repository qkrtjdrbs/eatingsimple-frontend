import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PageTitle from "../components/PageTitle";
import Loader from "react-loader-spinner";
import Post from "../components/Post";
import AddLayout from "../components/recipeWriteForm/AddLayout";
import { NoResult } from "./SearchResult";

const TagResult = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  font-size: 50px;
`;
const Tag = styled.p`
  color: ${(props) => props.theme.blue};
  margin-right: 15px;
`;
const Posts = styled(AddLayout)``;
const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SEARCH_RECIPE_BY_TAG = gql`
  query searchRecipesByTag($tag: String!) {
    searchRecipesByTag(tag: $tag) {
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

export default function TagRecipes() {
  const { tag } = useParams();
  const hashTag = "#" + tag;
  const { data, loading } = useQuery(SEARCH_RECIPE_BY_TAG, {
    variables: { tag: hashTag },
  });
  return (
    <div>
      <PageTitle title={"태그"} />
      <TagResult>
        🔎 <Tag>{hashTag}</Tag> 검색 결과
      </TagResult>
      <Posts>
        {loading ? (
          <Loading>
            <Loader type="ThreeDots" color="#0095f6" height={50} width={50} />
          </Loading>
        ) : data?.searchRecipesByTag?.length > 0 ? (
          data?.searchRecipesByTag.map((recipe) => (
            <Post key={recipe.id} sorting="recent" {...recipe} />
          ))
        ) : (
          <NoResult>검색 결과가 없어요 😢</NoResult>
        )}
      </Posts>
    </div>
  );
}
