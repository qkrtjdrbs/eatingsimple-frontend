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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import NestedComment from "./NestedComment";
import { SubmitButton } from "./Post";
import {
  DELETE_COMMENT_MUTATION,
  EDIT_COMMENT_MUTATION,
  TOGGLE_COMMENT_LIKE,
} from "../mutations/comment/commentMutations";

export const DELETED_COMMENT = "[삭제된 댓글입니다]";

const AvatarBox = styled.div``;
const CommentBox = styled.div`
  width: 100%;
  padding: 10px 15px;
  border-bottom: 1px solid ${(props) => props.theme.lightGreen};
  margin-bottom: 10px;
`;
const Author = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 13px;
`;
export const Username = styled.span`
  margin-left: 8px;
  font-size: 20px;
`;
const Payload = styled.div`
  display: flex;
  align-items: center;
  font-size: 17px;
  width: 100%;
  padding: 3px;
  word-break: break-all;
  white-space: pre-line;
  line-height: 1.5rem;
`;
const EditBox = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: 17px;
  width: 100%;
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
const Input = styled.input`
  width: 100%;
  height: 100px;
  word-break: break-all;
`;
const SeeReply = styled.div`
  color: ${(props) => props.theme.blue};
  cursor: pointer;
  margin-top: 10px;
`;
const EditForm = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const EditButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 90px;
  border: none;
  padding: 5px 10px;
  font-size: 15px;
  font-weight: 700;
  color: white;
  border-radius: 15px;
  background-color: ${(props) => props.theme.green};
  opacity: ${(props) => (props.disabled ? "0.4" : "1")};
  &:hover {
    cursor: pointer;
  }
  margin-right: 5px;
`;
const CancelButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 90px;
  border: none;
  padding: 5px 10px;
  font-size: 15px;
  font-weight: 700;
  color: white;
  border-radius: 15px;
  background-color: ${(props) => props.theme.red};
  opacity: ${(props) => (props.disabled ? "0.4" : "1")};
  &:hover {
    cursor: pointer;
  }
  margin-right: 5px;
`;
const PayloadBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
        id
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
      commentsCount
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
  nestedComments,
  nestedCommentsCount,
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
      if (!nestedCommentsCount) cache.evict({ id: `Comment:${id}` });
      else {
        const commentId = `Comment:${id}`;
        cache.modify({
          id: commentId,
          fields: {
            payload() {
              return DELETED_COMMENT;
            },
          },
        });
      }
      //modify comment number.
      const existingComments = cache.readQuery({
        query: SEE_RECIPE_QUERY,
        variables: { id: recipeId },
      });
      cache.writeQuery({
        query: SEE_RECIPE_QUERY,
        variables: { id: recipeId },
        data: {
          seeRecipe: {
            ...existingComments.seeRecipe,
            commentsCount: existingComments.seeRecipe.commentsCount - 1,
          },
        },
      });
    }
  };
  const updateCommentEdit = (cache, result) => {
    const {
      data: {
        editComment: { ok },
      },
    } = result;
    if (ok) {
      const commentId = `Comment:${id}`;
      cache.modify({
        id: commentId,
        fields: {
          payload() {
            return getValues("edit");
          },
        },
      });
      setToggleEditForm(!toggleEditForm);
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
  const [editComment] = useMutation(EDIT_COMMENT_MUTATION);
  const onDeleteClick = () => {
    if (window.confirm("댓글을 삭제할까요?")) {
      deleteComment();
    }
  };
  const { register, handleSubmit, setValue, formState, getValues } = useForm({
    mode: "onChange",
  });
  const onValid = () => {
    const payload = getValues("edit");
    editComment({ variables: { id, payload }, update: updateCommentEdit });
  };
  const onEditClick = () => {
    setToggleEditForm(!toggleEditForm);
    setValue("edit", payload);
  };
  const onCancelClick = () => {
    setToggleEditForm(!toggleEditForm);
  };
  const onClickReply = () => {
    setToggleReplyForm(!toggleReplyForm);
  };
  const onSeeReplies = () => {
    setToggleSeeReplies(!toggleSeeReplies);
  };
  const [toggleEditForm, setToggleEditForm] = useState(false);
  const [toggleReplyForm, setToggleReplyForm] = useState(false);
  const [toggleSeeReplies, setToggleSeeReplies] = useState(false);
  return (
    <CommentBox>
      <Author>
        <AvatarBox>
          <Link to={`/user/${user.username}`}>
            <Avatar url={user.avatar} />
          </Link>
        </AvatarBox>
        <Username>
          <Link to={`/user/${user.username}`}>{user.username}</Link>
        </Username>
        {toggleEditForm ? null : (
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
            {isMine && payload !== DELETED_COMMENT ? (
              <>
                <Button onClick={() => onEditClick()}>🔨</Button>
                <Button onClick={() => onDeleteClick()}>❌</Button>
              </>
            ) : null}
          </ButtonContainer>
        )}
      </Author>
      {toggleEditForm ? (
        <EditBox>
          <EditForm onSubmit={handleSubmit(onValid)}>
            <Input
              type="text"
              autoFocus
              {...register("edit", { required: true })}
            />
            <EditButton disabled={!formState.isValid} type="submit">
              수정
            </EditButton>
            <CancelButton onClick={() => onCancelClick()}>취소</CancelButton>
          </EditForm>
        </EditBox>
      ) : (
        <PayloadBox>
          {payload === DELETED_COMMENT ? (
            <Payload style={{ opacity: "0.5" }}>{payload}</Payload>
          ) : (
            <>
              <Payload>{payload}</Payload>
              <Button onClick={() => onClickReply()}>💬</Button>
            </>
          )}
        </PayloadBox>
      )}
      {toggleReplyForm ? (
        <div>
          <EditForm>
            <Input
              type="text"
              autoFocus
              {...register("reply", { required: true })}
            />
            <SubmitButton type="submit" disabled={!formState.isValid}>
              작성
            </SubmitButton>
          </EditForm>
        </div>
      ) : null}
      {nestedCommentsCount ? (
        <SeeReply onClick={() => onSeeReplies()}>
          {toggleSeeReplies
            ? "답글 닫기"
            : `답글 ${nestedCommentsCount}개 보기`}
        </SeeReply>
      ) : null}
      {toggleSeeReplies
        ? nestedComments?.map((comment) => (
            <NestedComment key={comment.id} {...comment} />
          ))
        : null}
    </CommentBox>
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
  nestedComments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }),
      payload: PropTypes.string.isRequired,
    })
  ),
  nestedCommentsCount: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
};
