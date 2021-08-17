import styled from "styled-components";
import { PropTypes, shape } from "prop-types";
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
        <EmptyRecipe>레시피가 없어요 😢</EmptyRecipe>
      )}
    </div>
  );
}

UserRecipes.propTypes = {
  username: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  recipes: PropTypes.arrayOf(
    shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }),
      likes: PropTypes.number.isRequired,
      isMine: PropTypes.bool.isRequired,
      isLiked: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
};
