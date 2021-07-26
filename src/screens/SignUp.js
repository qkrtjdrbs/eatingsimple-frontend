import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import FormsContainer from "../components/auth/FormsContainer";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import Button from "../components/auth/Button";
import { gql } from "@apollo/client/core";
import { useMutation } from "@apollo/client";
import FormError from "../components/auth/FormError";
import Loader from "react-loader-spinner";
import { routes } from "../routes";
import { useState } from "react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { PhotoContainer } from "../components/PhotoContainer";
import { NoPhotoNotice } from "../components/NoPhotoNotice";

const Icon = styled.div`
  margin-right: 10px;
  color: ${(props) => props.theme.red};
`;

const Title = styled.span`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 25px;
`;

const HomeLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;
const Avatar = styled.img`
  object-fit: contain;
  width: 100%;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $username: String!
    $password: String!
    $name: String!
    $email: String!
    $avatar: [Upload]
    $bio: String
  ) {
    createAccount(
      username: $username
      password: $password
      name: $name
      email: $email
      avatar: $avatar
      bio: $bio
    ) {
      ok
      error
    }
  }
`;

export default function SignUp() {
  const history = useHistory();
  const [avatar, setAvatar] = useState(null);
  const {
    register,
    handleSubmit,
    formState,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
  });
  const onCompleted = (data) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok) {
      return setError("result", { message: error });
    }
    const { username, password } = getValues();
    history.push(routes.login, {
      message: "계정이 생성되었습니다!",
      username,
      password,
    });
  };

  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const onSubmit = (data) => {
    if (loading) {
      return;
    }
    createAccount({
      variables: {
        ...data,
      },
    });
  };
  const clearSignUpError = () => {
    clearErrors("result");
  };
  const onChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setAvatar(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatar(reader.result);
    };
  };
  return (
    <AuthLayout>
      <PageTitle title="회원 가입" />
      <FormsContainer>
        <HomeLink href={routes.home}>
          <Icon>
            <FontAwesomeIcon icon={faUtensils} size="3x" />
          </Icon>
          <Title>모두의 레시피</Title>
        </HomeLink>
        {avatar ? (
          <PhotoContainer>
            <Avatar alt="preview" src={avatar} />
          </PhotoContainer>
        ) : (
          <PhotoContainer>
            <FontAwesomeIcon icon={faUser} size="10x" />
            <NoPhotoNotice>등록된 프로필 사진이 없습니다</NoPhotoNotice>
          </PhotoContainer>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormError message={errors?.result?.message} />
          <Input
            {...register("avatar")}
            type="file"
            onChange={onChange}
            placeholder="프로필 사진"
          />
          <Input
            {...register("username", {
              required: true,
              minLength: 4,
            })}
            type="text"
            onFocus={clearSignUpError}
            placeholder="아이디"
            hasError={Boolean(errors?.username?.message)}
          />
          <Input
            {...register("email", {
              required: true,
            })}
            type="email"
            onFocus={clearSignUpError}
            placeholder="이메일"
            hasError={Boolean(errors?.email?.message)}
          />
          <Input
            {...register("password", {
              required: true,
            })}
            type="password"
            onFocus={clearSignUpError}
            placeholder="비밀번호"
            hasError={Boolean(errors?.password?.message)}
          />
          <Input
            {...register("name", {
              required: true,
            })}
            type="text"
            onFocus={clearSignUpError}
            placeholder="이름"
            hasError={Boolean(errors?.name?.message)}
          />
          <Input
            {...register("bio", {
              required: true,
            })}
            type="text"
            onFocus={clearSignUpError}
            placeholder="자신을 간단히 소개해보세요!"
          />
          <Button type="submit" disabled={!formState.isValid || loading}>
            {loading ? (
              <Loader
                type="Circles"
                color="white"
                height={20}
                width={20}
                timeout={3000}
              />
            ) : (
              "가입"
            )}
          </Button>
        </form>
      </FormsContainer>
    </AuthLayout>
  );
}
