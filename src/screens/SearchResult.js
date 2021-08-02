import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Link, Route, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../components/auth/Avatar";
import { Username } from "../components/Comment";
import PageTitle from "../components/PageTitle";
import { IsMine } from "../components/Post";
import AddLayout from "../components/recipeWriteForm/AddLayout";
import Post from "../components/Post";
import Loader from "react-loader-spinner";

const SEARCH_RECIPES_QUERY = gql`
  query searchRecipes($keyword: String!) {
    searchRecipes(keyword: $keyword) {
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
const SEARCH_USERS_QUERY = gql`
  query searchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
      id
      username
      avatar
      isMe
    }
  }
`;
const SearchLayout = styled(AddLayout)``;
const Sorting = styled.div`
  font-size: 50px;
  margin-bottom: 50px;
`;
const ResultsBox = styled.div`
  margin-bottom: 50px;
`;
const Users = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 10px;
  margin-bottom: 10px;
`;
const AvatarBox = styled.div``;
const NoResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  opacity: 0.4;
`;
export default function SearchResult() {
  const { keyword } = useParams();
  const { data: recipeData, loading: loadingUsers } = useQuery(
    SEARCH_RECIPES_QUERY,
    {
      variables: { keyword },
    }
  );
  const { data: userData, loading: loadingRecipes } = useQuery(
    SEARCH_USERS_QUERY,
    {
      variables: { keyword },
    }
  );
  const location = useLocation();
  if (location?.state?.refresh) {
    window.location.reload();
  }
  return (
    <SearchLayout>
      <PageTitle title="검색 결과" />
      <Link to={`/search/${keyword}/users`}>
        <Sorting>👨‍👩‍👧‍👦 유저 검색 결과 보기</Sorting>
      </Link>
      <Route path={`/search/${keyword}/users`}>
        <ResultsBox>
          {loadingUsers ? (
            <Loader type="ThreeDots" color="#0095f6" height={50} width={50} />
          ) : userData?.searchUsers?.length ? (
            userData?.searchUsers?.map((user) => (
              <Users key={user.id}>
                {" "}
                <AvatarBox>
                  <Link to={`/user/${user.username}`}>
                    <Avatar url={user.avatar} />
                  </Link>
                </AvatarBox>
                <Username style={{ marginRight: "10px" }}>
                  <Link to={`/user/${user.username}`}>{user.username}</Link>
                </Username>
                <Link to={`/user/${user.username}`}>
                  {user.isMe ? <IsMine>ME</IsMine> : null}
                </Link>
              </Users>
            ))
          ) : (
            <NoResult>검색 결과가 없어요 😥</NoResult>
          )}
        </ResultsBox>
      </Route>
      <Link to={`/search/${keyword}/recipes`}>
        <Sorting>🍜 레시피 검색 결과 보기</Sorting>
      </Link>
      <Route path={`/search/${keyword}/recipes`}>
        {loadingRecipes ? (
          <Loader type="ThreeDots" color="#0095f6" height={50} width={50} />
        ) : recipeData?.searchRecipes?.length ? (
          recipeData?.searchRecipes?.map((recipe) => (
            <Post key={recipe.id} sorting="recent" {...recipe} />
          ))
        ) : (
          <NoResult>검색 결과가 없어요 😥</NoResult>
        )}
      </Route>
    </SearchLayout>
  );
}
