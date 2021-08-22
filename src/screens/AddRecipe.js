import FormsContainer from "../components/auth/FormsContainer";
import PageTitle from "../components/PageTitle";
import AddLayout from "../components/recipeWriteForm/AddLayout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PhotoContainer } from "../components/recipeWriteForm/PhotoContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";
import Slider from "react-slick";
import { useMutation } from "@apollo/client";
import FormError from "../components/auth/FormError";
import Button from "../components/auth/Button";
import { useHistory } from "react-router-dom";
import { Title } from "../components/recipeWriteForm/Title";
import { Content, ContentBox } from "../components/recipeWriteForm/Content";
import { Notice, Photo, Photos } from "../components/recipeWriteForm/Photo";
import { Tags } from "../components/recipeWriteForm/Tags";
import HomeLink from "../components/HomeLink";
import { CREATE_RECIPE_MUTATION } from "../mutations/recipe/recipeMutations";
import parsingTagAndMention from "../parsingTagAndMention";

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
    let tags = parsingTagAndMention("tag", data.tags);
    createRecipe({ variables: { ...data, tags } }).catch(() =>
      setError("result", {
        message: "서버 불안정으로 레시피를 올리지 못했습니다.",
      })
    );
  };
  const [createRecipe, { loading }] = useMutation(CREATE_RECIPE_MUTATION, {
    onCompleted,
  });
  return (
    <AddLayout>
      <PageTitle title="레시피 쓰기" />
      <HomeLink />
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
          <Tags
            {...register("tags")}
            type="text"
            placeholder="해시태그를 등록해주세요"
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
