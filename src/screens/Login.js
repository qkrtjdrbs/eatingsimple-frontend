import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import FormsContainer from "../components/auth/FormsContainer";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import LoginBtn from "../components/auth/LoginBtn";
import { gql } from "@apollo/client/core";
import { useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import FormError from "../components/auth/FormError";
import SignUpNotification from "../components/auth/SignUpNotification";
import Loader from "react-loader-spinner";
import { routes } from "../routes";

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
`;

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      error
      token
    }
  }
`;

export default function Login() {
  //loading states from sign-up page
  const location = useLocation();
  const history = useHistory();
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
    //give a default value by the Input name if previous states exist
    defaultValues: {
      username: location?.state?.username || "",
      password: location?.state?.password || "",
    },
  });
  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }
    if (token) {
      logUserIn(token);
      history.push("/");
    }
  };
  const [login, { loading }] = useMutation(LOGIN_MUTATION, { onCompleted });

  const onSubmit = () => {
    if (loading) {
      return;
    }
    const { username, password } = getValues();
    login({
      variables: { username, password },
    });
  };
  const clearLoginError = () => {
    clearErrors("result");
  };
  return (
    <AuthLayout>
      <PageTitle title="로그인" />
      <FormsContainer>
        <HomeLink href={routes.home}>
          <Icon>
            <FontAwesomeIcon icon={faUtensils} size="3x" />
          </Icon>
          <Title>모두의 레시피</Title>
        </HomeLink>
        <form onSubmit={handleSubmit(onSubmit)}>
          {location?.state?.message ? (
            <SignUpNotification>{location?.state?.message}</SignUpNotification>
          ) : null}
          <FormError message={errors?.result?.message} />
          <Input
            {...register("username", {
              required: true,
              minLength: 4,
            })}
            type="text"
            onFocus={clearLoginError}
            placeholder="아이디"
            hasError={Boolean(errors?.username?.message)}
          />
          <Input
            {...register("password", {
              required: true,
            })}
            type="password"
            onFocus={clearLoginError}
            placeholder="비밀번호"
            hasError={Boolean(errors?.password?.message)}
          />
          <LoginBtn type="submit" disabled={!formState.isValid || loading}>
            {loading ? (
              <Loader
                type="Circles"
                color="white"
                height={20}
                width={20}
                timeout={3000}
              />
            ) : (
              "로그인"
            )}
          </LoginBtn>
        </form>
      </FormsContainer>
    </AuthLayout>
  );
}
