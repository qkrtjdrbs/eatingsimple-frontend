import { PropTypes } from "prop-types";
import styled from "styled-components";
import parsingDate from "../parsingDate";
import Avatar from "./auth/Avatar";
import { Link } from "react-router-dom";

const AvatarBox = styled.div``;

const Author = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 15px;
  border-bottom: 1px solid gray;
`;
const Username = styled.span`
  margin-left: 8px;
  font-size: 20px;
`;
const Payload = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: 17px;
  width: 100%;
  border-left: 1px solid gray;
  padding: 0 10px;
  word-break: break-all;
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
  margin-left: 8px;
  font-size: 15px;
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

export default function Comment({
  user,
  payload,
  isMine,
  isLiked,
  likes,
  createdAt,
}) {
  return (
    <Author>
      <AvatarBox>
        <Link to={`/user/${user.username}`}>
          <Avatar url={user.avatar} />
        </Link>
      </AvatarBox>
      <Username>
        <Link to={`/user/${user.username}`}>{user.username}</Link>
      </Username>
      <Payload>{payload}</Payload>
      <ButtonContainer>
        <Created>{parsingDate(createdAt)}</Created>
        <LikesNComments>{likes} 💖</LikesNComments>
        {isMine ? (
          <>
            <Button onClick={() => alert("수정하기")}>🔨</Button>
            <Button onClick={() => alert("삭제하기")}>❌</Button>
          </>
        ) : null}
      </ButtonContainer>
    </Author>
  );
}

Comment.propTypes = {
  id: PropTypes.number.isRequired,
  payload: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }),
  likes: PropTypes.number.isRequired,
  isMine: PropTypes.bool.isRequired,
  isLiked: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
};
