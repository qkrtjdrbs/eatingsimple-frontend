import styled from "styled-components";
import Avatar from "./auth/Avatar";
import { Route, Link } from "react-router-dom";
import { PropTypes } from "prop-types";

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
        <div>열려라참깨</div>
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