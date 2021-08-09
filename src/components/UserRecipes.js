import styled from "styled-components";
import Post from "./Post";

const NoticeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;
const NoticeLine = styled.div`
  height: 2px;
  background-color: ${(props) => props.theme.lightGreen};
  width: 100%;
`;
const Notice = styled.div`
  font-size: 40px;
  height: 40px;
  white-space: nowrap;
  text-align: center;
  word-break: keep-all;
  padding: 0 10px;
`;
const EmptyRecipe = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: gray;
`;

export default function UserRecipes({ username, title, recipes }) {
  return (
    <div>
      <NoticeBox>
        <NoticeLine></NoticeLine>
        <Notice>
          {username}님{title}
        </Notice>
        <NoticeLine></NoticeLine>
      </NoticeBox>
      {recipes?.length > 0 ? (
        recipes.map((recipe) => (
          <Post key={recipe.id} sorting="recent" {...recipe} />
        ))
      ) : (
        <EmptyRecipe>작성한 레시피가 없어요 😢</EmptyRecipe>
      )}
    </div>
  );
}
