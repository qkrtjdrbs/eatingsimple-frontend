import { useMutation, useQuery } from "@apollo/client";
import { useLocation, useParams, useHistory } from "react-router-dom";
import AddLayout from "../components/recipeWriteForm/AddLayout";
import gql from "graphql-tag";
import styled from "styled-components";
import ProfileAvatar from "../components/ProfileAvatar";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";
import parsingDate from "../parsingDate";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { ME_QUERY } from "../hooks/useMe";

const Layout = styled(AddLayout)``;
const ProfileBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;
const UserInfo = styled.div`
  height: 200px;
  width: 400px;
  padding-left: 30px;
`;
const Username = styled.div`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 15px;
`;
const AvatarBox = styled.div`
  width: 200px;
`;
const AvatarInput = styled.input`
  margin-top: 12px;
`;
const Email = styled.div`
  font-size: 17px;
  margin-bottom: 10px;
`;
const EmailInput = styled.input`
  font-size: 17px;
  padding: 5px 10px;
  margin-bottom: 10px;
  width: 94%;
  border: 2px solid ${(props) => props.theme.lightGreen};
  border-radius: 10px;
`;
const Bio = styled.div`
  font-size: 20px;
  font-weight: 500;
  height: 50px;
  word-break: break-all;
  margin-bottom: 15px;
`;
const BioInput = styled.textarea`
  font-size: 20px;
  font-weight: 500;
  height: 100px;
  width: 100%;
  word-break: break-all;
  margin: 15px 0px;
  padding: 5px 10px;
  border: 2px solid
    ${(props) => (props.hasError ? props.theme.red : props.theme.lightGreen)};
  border-radius: 10px;
  font-family: "Jua", sans-serif;
  &::placeholder {
    font-family: "Jua", sans-serif;
    font-size: 20px;
  }
  &:focus {
    outline: none;
  }
`;
const RecipeAndComment = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
`;
const EditButton = styled(Button)`
  width: 100%;
  margin: auto;
  margin-bottom: 40px;
`;
const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ConfirmButton = styled(EditButton)`
  background-color: ${(props) => props.theme.lightGreen};
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  margin: 10px;
`;
const CancelButton = styled(EditButton)`
  background-color: ${(props) => props.theme.red};
  margin: 10px;
`;
const CreateDate = styled.div`
  font-size: 15px;
  opacity: 0.5;
  width: 80%;
`;
const UserRecipes = styled.div``;
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

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      name
      username
      email
      bio
      avatar
      recipes {
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
      recipesCount
      commentsCount
      isMe
      createdAt
    }
  }
`;

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $email: String
    $password: String
    $name: String
    $avatar: [Upload]
    $bio: String
  ) {
    editProfile(
      email: $email
      password: $password
      name: $name
      avatar: $avatar
      bio: $bio
    ) {
      id
      username
      email
      bio
      avatar
    }
  }
`;

//받은 좋아요 수 추가 ?

export default function Profile() {
  const { username } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({ mode: "onChange" });
  const [toggleEditForm, setToggleEditForm] = useState(false);
  const { data } = useQuery(SEE_PROFILE_QUERY, { variables: { username } });
  const [avatar, setavatar] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  useEffect(() => {
    setavatar(data?.seeProfile?.avatar);
  }, [data]);
  const location = useLocation();
  const history = useHistory();
  const createdDate = parsingDate(data?.seeProfile?.createdAt);
  if (location?.state?.refresh) {
    history.replace();
    window.location.reload();
  }
  const onEditClick = () => {
    setToggleEditForm(!toggleEditForm);
    setValue("email", data?.seeProfile?.email);
    setValue("bio", data?.seeProfile?.bio);
  };
  const onCancelClick = () => {
    setNewAvatar(null);
    setToggleEditForm(!toggleEditForm);
  };
  const onEditUpdate = (cache, result) => {
    const {
      data: {
        editProfile: { id, email, bio, avatar },
      },
    } = result;
    if (!id) {
      setError("result", { message: "프로필 변경에 실패했습니다" });
    } else {
      //프로필 창 cache 수정
      const userId = `User:${username}`;
      cache.modify({
        id: userId,
        fields: {
          email() {
            return email;
          },
          bio() {
            return bio;
          },
          avatar() {
            return avatar;
          },
        },
      });
      const originProfile = cache.readQuery({
        query: SEE_PROFILE_QUERY,
      });
      cache.writeQuery({
        query: SEE_PROFILE_QUERY,
        data: {
          seeProfile: {
            ...originProfile,
            email,
            bio,
            avatar,
          },
        },
      });
      const originMe = cache.readQuery({
        query: ME_QUERY,
      });
      cache.writeQuery({
        query: ME_QUERY,
        data: {
          seeProfile: {
            ...originMe,
            avatar,
          },
        },
      });
      setToggleEditForm(!toggleEditForm);
    }
  };
  const [editProfile, { loading }] = useMutation(EDIT_PROFILE_MUTATION, {
    update: onEditUpdate,
  });
  const onEditSubmit = (data) => {
    if (newAvatar) editProfile({ variables: { ...data } });
    else editProfile({ variables: { ...data, avatar: null } });
  };
  const onChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setNewAvatar(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewAvatar(reader.result);
    };
  };
  return (
    <Layout>
      <PageTitle title={username} />
      <ProfileBox>
        {toggleEditForm ? (
          <>
            <AvatarBox>
              <ProfileAvatar url={newAvatar ? newAvatar : avatar} />
              <AvatarInput
                type="file"
                {...register("avatar")}
                onChange={onChange}
              />
            </AvatarBox>
            <UserInfo>
              <Username>{data?.seeProfile?.username}</Username>
              <form onSubmit={handleSubmit(onEditSubmit)}>
                <FormError message={errors?.result?.message} />
                <EmailInput
                  type="email"
                  placeholder="이메일"
                  {...register("email")}
                  onFocus={() => clearErrors("result")}
                />
                <FormError message={errors?.bio?.message} />
                <BioInput
                  type="text"
                  placeholder="자신을 간단히 소개해보세요!"
                  {...register("bio", {
                    maxLength: {
                      value: 60,
                      message: "자기 소개는 최대 60자까지 작성 할 수 있습니다",
                    },
                  })}
                  onFocus={() => clearErrors("result")}
                  hasError={Boolean(errors?.bio)}
                />
                <Buttons>
                  <ConfirmButton disabled={!formState.isValid || loading}>
                    완료
                  </ConfirmButton>
                  <CancelButton onClick={() => onCancelClick()}>
                    취소
                  </CancelButton>
                </Buttons>
              </form>
            </UserInfo>
          </>
        ) : (
          <>
            <ProfileAvatar url={data?.seeProfile?.avatar} />
            <UserInfo>
              <Username>{data?.seeProfile?.username}</Username>
              <Email>{data?.seeProfile?.email}</Email>
              <Bio>{data?.seeProfile?.bio}</Bio>
              <RecipeAndComment>
                {data?.seeProfile?.recipesCount}🍴 •{" "}
                {data?.seeProfile?.commentsCount}
                💬
              </RecipeAndComment>
              <CreateDate>{createdDate} 생성</CreateDate>
            </UserInfo>
          </>
        )}
      </ProfileBox>
      {data?.seeProfile?.isMe && !toggleEditForm ? (
        <EditButton onClick={() => onEditClick()}>프로필 수정</EditButton>
      ) : null}
      {toggleEditForm ? null : (
        <UserRecipes>
          <NoticeBox>
            <NoticeLine></NoticeLine>
            <Notice>{data?.seeProfile?.username}님의 레시피</Notice>
            <NoticeLine></NoticeLine>
          </NoticeBox>
          {data?.seeProfile?.recipes?.length > 0 ? (
            data.seeProfile.recipes.map((recipe) => (
              <Post key={recipe.id} sorting="recent" {...recipe} />
            ))
          ) : (
            <EmptyRecipe>작성한 레시피가 없어요 😢</EmptyRecipe>
          )}
        </UserRecipes>
      )}
    </Layout>
  );
}
