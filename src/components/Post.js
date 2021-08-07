import styled from "styled-components";
import Avatar from "./auth/Avatar";
import { Route, Link, useHistory, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";
import Recipe from "./Recipe";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as SolidHeart,
  faCommentDots as SolidComment,
  faArrowUp,
  faTrashAlt,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { isLoggedInVar } from "../apollo";
import Comment, { DELETED_COMMENT } from "./Comment";
import parsingDate from "../parsingDate";
import { useForm } from "react-hook-form";
import { WRITE_COMMENT_MUTATION } from "../mutations/comment/commentMutations";
import {
  DELETE_RECIPE_MUTATION,
  TOGGLE_RECIPE_LIKE_MUTATION,
} from "../mutations/recipe/recipeMutations";

const PostBox = styled.div`
  border: 3px solid ${(props) => props.theme.lightGreen};
  border-radius: 15px;
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
  word-break: break-all;
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;
export const IsMine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 50px;
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
  font-size: 30px;
  margin-right: 5px;
`;

const Comments = styled.div`
  margin: 15px 0px;
  padding: 10px 20px;
  width: 100%;
`;

const NoComments = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
`;
const WriteComment = styled.div`
  margin: 15px 0px;
  padding: 10px 20px;
  width: 100%;
`;
const WriteForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Input = styled.input`
  width: 100%;
  height: auto;
  padding: 5px;
`;
export const SubmitButton = styled.button`
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
  background-color: ${(props) => props.theme.blue};
  opacity: ${(props) => (props.disabled ? "0.4" : "1")};
  &:hover {
    cursor: pointer;
  }
`;

export const SEE_RECIPE_QUERY = gql`
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
        nestedComments {
          id
          user {
            username
            avatar
          }
          payload
        }
        nestedCommentsCount
        createdAt
      }
      commentsCount
    }
  }
`;

export default function Post({
  id: recipeId,
  title,
  likes,
  user,
  isMine,
  isLiked,
  sorting,
  createdAt,
}) {
  const updateRecipeLike = (cache, result) => {
    const {
      data: {
        toggleRecipeLike: { ok },
      },
    } = result;
    if (ok) {
      const recipe = `Recipe:${recipeId}`;
      cache.modify({
        id: recipe,
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
  const isLoggedIn = isLoggedInVar();
  const { data } = useQuery(SEE_RECIPE_QUERY, { variables: { id: recipeId } });
  const [toggleRecipeLike] = useMutation(TOGGLE_RECIPE_LIKE_MUTATION, {
    variables: { id: recipeId },
    update: updateRecipeLike,
  });
  const history = useHistory();
  const location = useLocation();
  if (location?.state?.refresh) {
    window.location.reload();
  }
  const updateComments = (cache, result) => {
    setValue("payload", "");
    const {
      data: { writeComment },
    } = result;
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
          comments: [...existingComments.seeRecipe.comments, writeComment],
          commentsCount: existingComments.seeRecipe.commentsCount + 1,
        },
      },
    });
  };
  const [writeComment, { loading }] = useMutation(WRITE_COMMENT_MUTATION, {
    update: updateComments,
  });
  const onDeleteClick = () => {
    if (window.confirm("이 레시피를 삭제할까요?")) {
      deleteRecipe();
    }
  };
  const updateDeleteRecipe = (cache, result) => {
    const {
      data: {
        deleteRecipe: { ok, error },
      },
    } = result;
    if (!ok) {
      alert(error);
      return;
    }
    cache.evict({ id: `Recipe:${recipeId}` });
  };
  const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
    variables: { id: recipeId },
    update: updateDeleteRecipe,
  });
  const { register, handleSubmit, formState, clearErrors, setValue } = useForm({
    mode: "onChange",
  });
  const onVaild = (data) => {
    const { payload } = data;
    if (loading) {
      return;
    }
    if (payload === DELETED_COMMENT) {
      alert("이 댓글은 작성하실 수 없습니다");
      return;
    }
    writeComment({
      variables: {
        recipeId,
        payload,
      },
    });
  };
  return (
    <PostBox>
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
          <Link to={`/recipes/${sorting}/${recipeId}`}>{title}</Link>
        </Title>
        <ButtonContainer>
          <Created>{parsingDate(createdAt)}</Created>
          <LikesNComments>
            {likes} 💖 | {data?.seeRecipe?.commentsCount} 💬
          </LikesNComments>
          {isMine ? <IsMine>MY</IsMine> : null}
        </ButtonContainer>
      </Author>
      <Route path={`/recipes/${sorting}/${recipeId}`}>
        <Recipe {...data?.seeRecipe} />
        <Icons>
          <Icon
            onClick={
              isLoggedIn
                ? toggleRecipeLike
                : () => alert("로그인 유저만 가능합니다!")
            }
          >
            <FatText>{likes}</FatText>
            <FontAwesomeIcon
              style={{ color: isLiked ? "tomato" : "inherit" }}
              size="2x"
              icon={isLiked ? SolidHeart : faHeart}
            />
          </Icon>
          <Icon>
            <FatText>{data?.seeRecipe?.commentsCount}</FatText>
            <FontAwesomeIcon size="2x" icon={SolidComment} color="#0095f6" />
          </Icon>
          {isMine ? (
            <Link
              to={{
                pathname: `/recipe/${recipeId}`,
                state: { title, ...data?.seeRecipe },
              }}
            >
              <Icon>
                <FatText>수정</FatText>
                <FontAwesomeIcon size="2x" icon={faTools} color="#26cc49" />
              </Icon>
            </Link>
          ) : null}
          {isMine ? (
            <Icon onClick={() => onDeleteClick()}>
              <FatText>삭제</FatText>
              <FontAwesomeIcon size="2x" icon={faTrashAlt} color="#F7323F" />
            </Icon>
          ) : null}
          <Icon onClick={() => history.push(`/recipes/${sorting}`)}>
            <FatText>접기</FatText>
            <FontAwesomeIcon size="2x" icon={faArrowUp} color="#F7C93F" />
          </Icon>
        </Icons>
        <Comments>
          {data?.seeRecipe?.commentsCount !== 0 ? (
            data?.seeRecipe?.comments.map((comment) => (
              <Comment key={comment.id} recipeId={recipeId} {...comment} />
            ))
          ) : (
            <NoComments>아직 작성된 댓글이 없어요</NoComments>
          )}
        </Comments>
        <WriteComment>
          {isLoggedIn ? (
            <WriteForm onSubmit={handleSubmit(onVaild)}>
              <Input
                {...register("payload", { required: true })}
                type="text"
                placeholder="자유롭게 댓글을 작성해주세요!"
                onFocus={() => clearErrors("payload")}
              />
              <SubmitButton
                type="submit"
                disabled={!formState.isValid || loading}
              >
                {loading ? "작성중..." : "작성"}
              </SubmitButton>
            </WriteForm>
          ) : (
            <NoComments>댓글을 작성하려면 로그인 해주세요!</NoComments>
          )}
        </WriteComment>
      </Route>
    </PostBox>
  );
}

Post.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }),
  likes: PropTypes.number.isRequired,
  isMine: PropTypes.bool.isRequired,
  isLiked: PropTypes.bool.isRequired,
  sorting: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
};
