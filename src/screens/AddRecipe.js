import styled from "styled-components";
import FormsContainer from "../components/auth/FormsContainer";
import PageTitle from "../components/PageTitle";
import AddLayout from "../components/AddLayout";
import Input from "../components/auth/Input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PhotoContainer } from "../components/PhotoContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { NoPhotoNotice } from "../components/NoPhotoNotice";
import Loader from "react-loader-spinner";
import Slider from "react-slick";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import FormError from "../components/auth/FormError";
import Button from "../components/auth/Button";
import { useHistory } from "react-router-dom";

const CREATE_RECIPE_MUTATION = gql`
  mutation createRecipe($title: String!, $content: String!, $files: [Upload]) {
    createRecipe(title: $title, content: $content, files: $files) {
      ok
      error
      id
    }
  }
`;

const ContentBox = styled.div`
  width: 100%;
  margin: 15px 0px;
  padding: 10px 20px;
  .slick-prev:before {
    opacity: 1;
    color: black;
    left: 0;
  }
  .slick-next:before {
    opacity: 1;
    color: black;
  }
`;
const Title = styled(Input)`
  margin-bottom: 10px;
`;
const Content = styled.textarea`
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 10px;
  height: 400px;
  border: 0.5px solid rgb(219, 219, 219);
  font-family: "Jua", sans-serif;
  font-size: 20px;
  &::placeholder {
    font-family: "Jua", sans-serif;
    font-size: 20px;
  }
`;
const Photos = styled(Input)``;
const Photo = styled.img`
  object-fit: contain;
  width: 100%;
`;
const Notice = styled(NoPhotoNotice)`
  background-color: ${(props) => props.theme.red};
  width: 50%;
  text-align: center;
`;

export default function AddRecipe() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [photoURLs, setPhotoURLs] = useState(null);
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
  });
  const onChange = (e) => {
    const {
      target: { files },
    } = e;
    if (!files) {
      setPhotoURLs(null);
      return;
    }
    let fileList = [];
    for (let i = 0, f; (f = files[i]); i++) {
      const reader = new FileReader();
      reader.onload = () => {
        fileList.push(reader.result);
        if (fileList.length === files.length) setPhotoURLs(fileList);
      };
      reader.readAsDataURL(f);
    }
  };
  const onCompleted = (data) => {
    const {
      createRecipe: { ok, error, id },
    } = data;
    if (!ok) {
      return setError("result", { message: error });
    }
    history.push(`/recipes/recent/${id}`, { id });
  };
  const onValid = (data) => {
    if (loading) {
      return;
    }
    createRecipe({ variables: { ...data } });
    return null;
  };
  const [createRecipe, { loading }] = useMutation(CREATE_RECIPE_MUTATION, {
    onCompleted,
  });
  return (
    <AddLayout>
      <PageTitle title="레시피 쓰기" />
      <FormsContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <FormError message={errors?.result?.message} />
          <Title
            {...register("title", { required: true })}
            type="text"
            placeholder="제목을 입력해주세요"
            onFocus={() => clearErrors("result")}
          />
          <Content
            {...register("content", { required: true })}
            type="text"
            placeholder="레시피에 대한 간단한 설명을 써주세요"
            onFocus={() => clearErrors("result")}
          />
          {photoURLs ? (
            <ContentBox>
              <Slider {...settings}>
                {photoURLs.map((photo, index) => (
                  <Photo alt="preview" key={index} src={photo} />
                ))}
              </Slider>
            </ContentBox>
          ) : (
            <PhotoContainer>
              <FontAwesomeIcon icon={faImages} size="9x" />
              <Notice>등록된 사진이 없어요</Notice>
            </PhotoContainer>
          )}
          <Photos
            {...register("files")}
            onChange={onChange}
            type="file"
            multiple
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
              "작성"
            )}
          </Button>
        </form>
      </FormsContainer>
    </AddLayout>
  );
}
