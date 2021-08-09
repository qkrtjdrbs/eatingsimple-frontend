import { useMutation, useQuery } from "@apollo/client";
import { useLocation, useParams, useHistory } from "react-router-dom";
import AddLayout from "../components/recipeWriteForm/AddLayout";
import gql from "graphql-tag";
import styled from "styled-components";
import ProfileAvatar from "../components/ProfileAvatar";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";
import parsingDate from "../parsingDate";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import UserRecipes from "../components/UserRecipes";

const Layout = styled(AddLayout)``;
const AvatarContainer = styled.div`
  position: relative;
`;
const RecieveHearts = styled.div`
  position: absolute;
  top: 5px;
  background-color: #383838;
  color: white;
  height: 22px;
  padding: 5px 10px;
  border-radius: 20px;
`;
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
const TabButton = styled.span`
  cursor: pointer;
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
const SEE_USER_LIKE_RECIPES = gql`
  query userLikeRecipes($id: Int!) {
    userLikeRecipes(id: $id) {
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
  const { data: likeData } = useQuery(SEE_USER_LIKE_RECIPES, {
    variables: { id: data?.seeProfile?.id },
  });
  const tabs = {
    0: (
      <UserRecipes
        username={data?.seeProfile?.username}
        title={"의 레시피"}
        recipes={data?.seeProfile?.recipes}
      />
    ),
    1: (
      <UserRecipes
        username={data?.seeProfile?.username}
        title={"이 좋아한 레시피"}
        recipes={likeData?.userLikeRecipes}
      />
    ),
  };
  let hearts = 0;
  data?.seeProfile?.recipes?.forEach((recipe) => (hearts += recipe.likes));
  const [avatar, setavatar] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [tab, setTab] = useState(0);
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
  if (!data?.seeProfile?.username)
    return (
      <Layout>
        <PageTitle title="존재하지 않는 유저" />
        <EmptyRecipe>존재하지 않는 유저입니다</EmptyRecipe>
      </Layout>
    );
  else
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
                        message:
                          "자기 소개는 최대 60자까지 작성 할 수 있습니다",
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
              <AvatarContainer>
                <RecieveHearts>{hearts}💕</RecieveHearts>
                <ProfileAvatar url={data?.seeProfile?.avatar} />
              </AvatarContainer>
              <UserInfo>
                <Username>{data?.seeProfile?.username}</Username>
                <Email>{data?.seeProfile?.email}</Email>
                <Bio>{data?.seeProfile?.bio}</Bio>
                <RecipeAndComment>
                  <TabButton onClick={() => setTab(0)}>
                    {data?.seeProfile?.recipesCount}🍴
                  </TabButton>{" "}
                  • {data?.seeProfile?.commentsCount}💬 •{" "}
                  <TabButton onClick={() => setTab(1)}>
                    {likeData?.userLikeRecipes.length}💖
                  </TabButton>
                </RecipeAndComment>
                <CreateDate>{createdDate} 생성</CreateDate>
              </UserInfo>
            </>
          )}
        </ProfileBox>
        {data?.seeProfile?.isMe && !toggleEditForm ? (
          <EditButton onClick={() => onEditClick()}>프로필 수정</EditButton>
        ) : null}
        {toggleEditForm ? null : tabs[tab]}
      </Layout>
    );
}
