import { PropTypes } from "prop-types";
import styled from "styled-components";
import parsingDate from "../parsingDate";
import Avatar from "./auth/Avatar";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as ColoredThumbsUp } from "@fortawesome/free-solid-svg-icons";

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

const Like = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  padding: 5px 10px;
  font-size: 15px;
  cursor: pointer;
`;
const Likes = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;
const Created = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: auto;
  opacity: 0.5;
`;

const TOGGLE_COMMENT_LIKE = gql`
  mutation toggleCommentLike($id: Int!) {
    toggleCommentLike(id: $id) {
      ok
    }
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

export default function Comment({
  id,
  user,
  payload,
  isMine,
  isLiked,
  likes,
  recipeId,
  createdAt,
}) {
  const updateCommentLike = (cache, result) => {
    const {
      data: {
        toggleCommentLike: { ok },
      },
    } = result;
    if (ok) {
      const commentId = `Comment:${id}`;
      cache.modify({
        id: commentId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const updateCommentDelete = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      //delete comment from cache.
      cache.evict({ id: `Comment:${id}` });
      //modify comment number.
      cache.modify({
        id: `Recipe:${recipeId}`,
        fields: {
          commentsCount(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [toggleCommentLike] = useMutation(TOGGLE_COMMENT_LIKE, {
    variables: { id },
    update: updateCommentLike,
  });
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: { id },
    update: updateCommentDelete,
  });
  const onDeleteClick = () => {
    if (window.confirm("댓글을 삭제할까요?")) {
      deleteComment();
    }
  };

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
        <Like onClick={toggleCommentLike}>
          <Likes>{likes}</Likes>
          {isLiked ? (
            <FontAwesomeIcon icon={ColoredThumbsUp} color={"tomato"} />
          ) : (
            <FontAwesomeIcon icon={faThumbsUp} />
          )}
        </Like>
        {isMine ? (
          <>
            <Button onClick={() => alert("수정하기")}>🔨</Button>
            <Button onClick={() => onDeleteClick()}>❌</Button>
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
