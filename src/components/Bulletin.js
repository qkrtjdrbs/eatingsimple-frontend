import styled from "styled-components";
import Avatar from "./auth/Avatar";
import { Route, Link, useHistory } from "react-router-dom";
import { PropTypes } from "prop-types";
import Recipe from "./Recipe";
import { gql, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as SolidHeart,
  faCommentDots as SolidComment,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const BulletinBox = styled.div`
  border: 2px solid black;
  padding: 10px 15px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  max-width: 1000px;
  &:hover {
    border-color: ${(props) => props.theme.blue};
  }
`;
const AvatarBox = styled.div``;
const Author = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;
const Username = styled.span`
  margin-left: 8px;
  font-size: 20px;
`;
const Title = styled.div`
  margin-left: 10px;
  font-size: 20px;
  width: 85%;
  border-left: 1px solid gray;
  padding: 0 10px;
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;
const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 90px;
  padding: 5px 10px;
  font-size: 15px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.yellow};
  &:hover {
    cursor: pointer;
  }
`;

const LikesNComments = styled.div`
  width: auto;
  padding: 5px 10px;
`;

const Created = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: auto;
  opacity: 0.5;
`;

const Icons = styled.div`
  margin: 15px 0px;
  padding: 10px 20px;
  width: 100%;
  display: flex;
  align-items: center;
`;
const Icon = styled.div`
  cursor: pointer;
  margin-right: 25px;
`;

const FatText = styled.span`
  font-weight: 700;
  font-size: 33px;
  margin-right: 5px;
`;

const SEE_RECIPE_QUERY = gql`
  query seeRecipe($id: Int!) {
    seeRecipe(id: $id) {
      content
      photos {
        id
        file
      }
      comments {
        user {
          username
          avatar
        }
        payload
        isMine
        isLiked
        likes
        createdAt
      }
      isLiked
    }
  }
`;

export default function Bulletin({
  id,
  title,
  likes,
  user,
  commentsCount,
  isMine,
  sorting,
  createdAt,
}) {
  const { data } = useQuery(SEE_RECIPE_QUERY, { variables: { id } });
  const history = useHistory();
  function formatDate(date) {
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ""
    );
  }
  createdAt = new Date(createdAt);
  return (
    <BulletinBox>
      <Author>
        <AvatarBox>
          <Link to={`/user/${user.username}`}>
            <Avatar url={user.avatar} />
          </Link>
        </AvatarBox>
        <Username>
          <Link to={`/user/${user.username}`}>{user.username}</Link>
        </Username>
        <Title>
          <Link to={`/recipes/recent/${id}`}>{title}</Link>
        </Title>
        <ButtonContainer>
          <Created>{formatDate(createdAt)}</Created>
          <LikesNComments>
            {likes} 💖 | {commentsCount} 💬
          </LikesNComments>
          {isMine ? <Button>수정 / 삭제</Button> : null}
        </ButtonContainer>
      </Author>
      <Route path={`/recipes/${sorting}/${id}`}>
        <Recipe {...data?.seeRecipe} />
        <Icons>
          <Icon>
            <FatText>{likes}</FatText>
            <FontAwesomeIcon
              style={{ color: data?.seeRecipe?.isLiked ? "tomato" : "inherit" }}
              size="2x"
              icon={data?.seeRecipe?.isLiked ? SolidHeart : faHeart}
            />
          </Icon>
          <Icon>
            <FatText>{commentsCount}</FatText>
            <FontAwesomeIcon size="2x" icon={SolidComment} color="#0095f6" />
          </Icon>
          <Icon onClick={() => history.push(`/recipes/${sorting}`)}>
            <FatText>접기</FatText>
            <FontAwesomeIcon size="2x" icon={faArrowUp} color="#F7C93F" />
          </Icon>
        </Icons>
      </Route>
    </BulletinBox>
  );
}

Bulletin.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }),
  commentsCount: PropTypes.number.isRequired,
  likes: PropTypes.number.isRequired,
  isMine: PropTypes.bool.isRequired,
};
